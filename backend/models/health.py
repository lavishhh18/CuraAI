from pydantic import BaseModel
from typing import Optional, Dict


class HealthLogRequest(BaseModel):
    clerk_id: str
    date: Optional[str] = ""           # YYYY-MM-DD — one log per day, auto-set if empty
    sleep_hours: Optional[str] = ""    # e.g. "6.5"
    steps: Optional[str] = ""         # e.g. "7432"
    water_glasses: Optional[str] = "" # e.g. "5"
    heart_rate: Optional[str] = ""    # e.g. "72"
    bmi: Optional[str] = ""           # e.g. "22.5"
    habits: Optional[Dict[str, bool]] = {}  # {"morning_walk": True, "meditate": False}
