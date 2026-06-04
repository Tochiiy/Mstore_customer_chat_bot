import os
from dotenv import load_dotenv
from openai import AsyncOpenAI
from backend.services.vector_store import vector_store

load_dotenv()


CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")
if not CEREBRAS_API_KEY:
    raise ValueError("CRITICAL ERROR: CEREBRAS_API_KEY is missing from environment setup.")


client = AsyncOpenAI(
    base_url="https://api.cerebras.ai/v1",
    api_key=CEREBRAS_API_KEY
)


MODEL_NAME = "llama3.1-8b"
MAX_TOP_K = 3

SYSTEM_MESSAGE = (
    "You are a helpful and professional shopping assistant for our e-commerce store.\n"
    "Your primary goal is to help users find accurate information about our products, "
    "including specific details, availability, and personalized recommendations based on their preferences.\n\n"
    "CRITICAL RULES:\n"
    "1. Use ONLY the product context provided in the conversation to answer user queries.\n"
    "2. Do not invent, hallucinate, or assume any product details (such as price, color, or features) "
    "if they are not explicitly present in the retrieved context.\n"
    "3. If the provided context does not contain enough information to accurately answer the user's "
    "question, state cleanly: 'I'm sorry, I don't have that information about the product right now.'"
)


async def get_relevant_context(query: str) -> str:
    """
    Asynchronously queries the vector database and formats all matching records.
    Uses your existing Gemini embedding configuration inside vector_store.
    """
    try:
        results = await vector_store.asimilarity_search(query, k=MAX_TOP_K)
        if not results:
            return ""

        context_blocks = []
        for index, doc in enumerate(results):
            meta = doc.metadata
            product_info = (
                f"--- Product Option {index + 1} ---\n"
                f"Product Name: {meta.get('ProductName', 'N/A')}\n"
                f"Brand: {meta.get('ProductBrand', 'N/A')}\n"
                f"Gender: {meta.get('Gender', 'N/A')}\n"
                f"Price: ${meta.get('Price', 'N/A')}\n"
                f"Primary Color: {meta.get('PrimaryColor', 'N/A')}\n"
                f"Description: {meta.get('Description', 'N/A')}\n"
            )
            context_blocks.append(product_info)

        return "\n".join(context_blocks)

    except Exception as e:
        print(f"Database exception during similarity search: {str(e)}")
        return "" 


async def generate_response(query: str, history: list = None) -> tuple[str, list]:
    """
    Generates an ultra-low latency response asynchronously using Cerebras inference,
    preserving chat history state natively.
    """
    if history is None:
        history = []

    context = await get_relevant_context(query)

    if not context:
        fallback_msg = "I'm sorry, I don't have that information about the product right now."
        history.append({"role": "user", "content": query})
        history.append({"role": "assistant", "content": fallback_msg})
        return fallback_msg, history

   
    messages = [
        {"role": "system", "content": SYSTEM_MESSAGE},
    ]
    
    for message in history:
        messages.append({"role": message.get("role"), "content": message.get("content")})
        
    
    current_prompt = f"Context:\n{context}\n\nUser Query: {query}"
    messages.append({"role": "user", "content": current_prompt})

    try:
       
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        final_text = response.choices[0].message.content

      
        history.append({"role": "user", "content": query})
        history.append({"role": "assistant", "content": final_text})
        
        return final_text, history

    except Exception as e:
        print(f"API Error during Cerebras inference execution: {str(e)}")
        error_msg = "I encountered an error retrieving product details. Please try again shortly."
        return error_msg, history