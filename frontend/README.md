# 👟 AI Shop Assistant Bot

# live https://mstoreec.vercel.app

A full-stack, AI-powered e-commerce chat assistant. This application allows users to search, filter, and discover products (specifically sneakers) using natural language conversational AI.

The frontend is a lightweight React/Vite SPA, and the backend is a FastAPI service powered by LangChain and Google's Gemini models for retrieval-augmented generation (RAG) against a MySQL product catalog.

## 🛠 Tech Stack

**Frontend:**

- React 18 + TypeScript
- Vite (Bundler)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- Vercel (Deployment)

**Backend:**

- Python 3.12+
- FastAPI + Uvicorn
- Google Generative AI (Gemini) + LangChain
- SQLAlchemy + PyMySQL (Database ORM & Driver)
- Pandas (For initial data migration)
- Render (Deployment)

**Database:**

- MySQL (Hosted on Aiven)

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18+)
- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (Extremely fast Python package manager - recommended)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Shop_Assistant_bot
```
