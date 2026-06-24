from app.database.base import Base
from app.database.connection import engine

from app.models.user import User
from app.models.expense import Expense

Base.metadata.create_all(bind=engine)

print("Tables created successfully")