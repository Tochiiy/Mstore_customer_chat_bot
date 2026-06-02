from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from backend.services.retrieval_gemini_ai import generate_response

app = FastAPI()

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    history: list[dict] = [] 

# 2. Use the instantiated router instance
@router.post("/chat")
async def chat(request: ChatRequest):
    response, updated_history = await generate_response(request.query, request.history)
    return {"response": response, "history": updated_history}


app.include_router(router)