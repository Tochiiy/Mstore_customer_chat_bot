import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore # (Renamed import slightly for standard convention)

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")

pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")

if not pinecone_api_key or not pinecone_index_name:
    raise ValueError(
        "CRITICAL ERROR: Please ensure PINECONE_API_KEY and PINECONE_INDEX_NAME are set in your .env file."
    )    

pinecone_client = Pinecone(api_key=pinecone_api_key)    
pinecone_index = pinecone_client.Index(name=pinecone_index_name)


vector_store = PineconeVectorStore(
    index=pinecone_index,
    embedding=embeddings,
    text_key="text_content"  
)

