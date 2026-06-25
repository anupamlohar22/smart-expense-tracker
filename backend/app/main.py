from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI

from app.routers.user import router as user_router

app = FastAPI(
    title="Expense Tracker API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://smart-expense-tracker-three-murex.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)


@app.get("/")
def home():
    return {
        "message": "Expense Tracker API Running"
    }