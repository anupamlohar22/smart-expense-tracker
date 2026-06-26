from fastapi import HTTPException

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database.dependencies import get_db
from app.models.user import User
from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate
)

from app.schemas.user import UserCreate, UserLogin

from app.auth.security import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import create_access_token


router = APIRouter()


@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        return {
            "message": "Email already registered"
        }

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(
            user.password
        )
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        db_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
    data={
        "sub": db_user.email,
        "name": db_user.name
    }
)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(
    current_user: str = Depends(get_current_user)
):
    return {
        "email": current_user
    }

@router.post("/expenses")
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = (
        db.query(User)
        .filter(User.email == current_user)
        .first()
    )

    new_expense = Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        user_id=user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return {
        "message": "Expense created successfully"
    }

@router.get("/expenses")
def get_expenses(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = (
        db.query(User)
        .filter(User.email == current_user)
        .first()
    )

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == user.id)
        .all()
    )

    return expenses

@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = (
        db.query(User)
        .filter(User.email == current_user)
        .first()
    )

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == user.id
        )
        .first()
    )

    if not expense:
        return {
            "message": "Expense not found"
        }

    db.delete(expense)
    db.commit()

    return {
        "message": "Expense deleted successfully"
    }

@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = (
        db.query(User)
        .filter(User.email == current_user)
        .first()
    )

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == user.id
        )
        .first()
    )

    if not expense:
        return {
            "message": "Expense not found"
        }

    expense.title = expense_data.title
    expense.amount = expense_data.amount
    expense.category = expense_data.category

    db.commit()
    db.refresh(expense)

    return {
        "message": "Expense updated successfully"
    }