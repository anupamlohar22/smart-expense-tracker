from fastapi import FastAPI

from app.routers.user import router as user_router

app = FastAPI(
    title="Expense Tracker API"
)

app.include_router(user_router)


@app.get("/")
def home():
    return {
        "message": "Expense Tracker API Running"
    }