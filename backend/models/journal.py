from pydantic import BaseModel
from typing import List, Optional


class JournalEntryRequest(BaseModel):
    clerk_id: str
    mood: str                          # "Great" | "Good" | "Okay" | "Bad" | "Terrible"
    text: str
    tags: Optional[List[str]] = []     # ["College", "Stress", ...]
