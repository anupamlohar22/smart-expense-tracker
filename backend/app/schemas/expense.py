from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str

class ExpenseUpdate(BaseModel):
    title: str
    amount: float
    category: str