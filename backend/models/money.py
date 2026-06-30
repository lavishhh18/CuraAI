from pydantic import BaseModel
from typing import Optional


class TransactionRequest(BaseModel):
    clerk_id: str
    name: str                          # "Swiggy", "Amazon" etc.
    amount: str                        # kept as string — DynamoDB Decimal issues
    category: str                      # "Food" | "Transport" | "Shopping" | "Education" | "Entertainment" | "Others"
    type: str                          # "expense" | "income"
    date: Optional[str] = ""           # ISO date string, auto-set if empty
