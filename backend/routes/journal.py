"""
journal.py — Journal entry creation and retrieval routes.
"""

from fastapi import APIRouter
from models.journal import JournalEntryRequest
from services.dynamodb import create_journal_entry, get_journal_entries

router = APIRouter()


# --- Routes ---

@router.post("/")
def save_journal(data: JournalEntryRequest):
    """Create a new journal entry for the user."""
    item = data.model_dump()
    item["userId"] = item.pop("clerk_id")
    entry = create_journal_entry(item)
    return {"message": "Journal entry saved", "entry": entry}


@router.get("/{user_id}")
def list_journal(user_id: str):
    """Retrieve all journal entries for a given user, sorted by most recent."""
    entries = get_journal_entries(user_id)
    return {"entries": entries}
