"""
money.py — Transaction creation and retrieval routes for the money tracker.
"""

from fastapi import APIRouter
from models.money import TransactionRequest
from services.dynamodb import create_transaction, get_transactions

router = APIRouter()


# --- Routes ---

@router.post("/")
def save_transaction(data: TransactionRequest):
    """Save a new income or expense transaction."""
    item = data.model_dump()
    item["userId"] = item.pop("clerk_id")
    transaction = create_transaction(item)
    return {"message": "Transaction saved", "transaction": transaction}


@router.get("/{user_id}")
def list_transactions(user_id: str):
    """Retrieve all transactions for a given user, sorted by most recent."""
    transactions = get_transactions(user_id)
    return {"transactions": transactions}
