from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.chat import router as chat_router
from backend.routes.products import router as products_router

app = FastAPI(title="Shop Assistant Bot API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://mstoreec.vercel.app/"],
    allow_methods=["*"],
    allow_headers=["*"],    allow_credentials=True 
)

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the Shop Assistant Bot API! Use /docs for API documentation."}

@app.get("/health", tags=["Health Check"])
async def health_check():
    return {"status": "ok", "message": "Shop Assistant Bot API is healthy and running."}    



app.include_router(chat_router)
app.include_router(products_router)  

#if __name__ == "__main__":
    #import uvicorn
    #uvicorn.run(app, host="0.0.0.0", port=8000) 