"""
cycle.py — Menstrual cycle tracking and prediction routes.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from services.dynamodb import log_period, get_cycle_history
from datetime import datetime, timedelta

router = APIRouter()


# --- Request Models ---

class PeriodLog(BaseModel):
    """Schema for logging a period entry."""
    user_id: str
    start_date: str
    end_date: Optional[str] = None
    symptoms: List[str] = []
    flow: str = "medium"


# --- Helper Functions ---

def predict_next_cycle(history: list) -> dict:
    """Predict the next period, fertile window, and ovulation based on cycle history."""
    if len(history) < 2:
        return {
            "next_period": None,
            "days_until_next": None,
            "fertile_window_start": None,
            "fertile_window_end": None,
            "ovulation_date": None,
            "cycle_length": 28,
            "pms_alert": False,
        }

    dates = [datetime.fromisoformat(h["start_date"]) for h in history if h.get("start_date")]
    dates = sorted(dates, reverse=True)

    cycle_lengths = [
        (dates[i] - dates[i + 1]).days
        for i in range(min(3, len(dates) - 1))
    ]
    avg_cycle = int(sum(cycle_lengths) / len(cycle_lengths))

    last_period = dates[0]
    next_period = last_period + timedelta(days=avg_cycle)
    ovulation = next_period - timedelta(days=14)
    fertile_start = ovulation - timedelta(days=5)
    fertile_end = ovulation + timedelta(days=1)
    days_until = (next_period - datetime.now()).days

    return {
        "next_period": next_period.strftime("%Y-%m-%d"),
        "days_until_next": max(0, days_until),
        "fertile_window_start": fertile_start.strftime("%Y-%m-%d"),
        "fertile_window_end": fertile_end.strftime("%Y-%m-%d"),
        "ovulation_date": ovulation.strftime("%Y-%m-%d"),
        "cycle_length": avg_cycle,
        "pms_alert": 0 <= days_until <= 5,
    }


# --- Routes ---

@router.post("/log")
def log_period_route(data: PeriodLog):
    """Log a new period entry with start/end dates, flow, and symptoms."""
    entry = log_period(
        data.user_id,
        data.start_date,
        data.end_date,
        data.symptoms,
        data.flow,
    )
    return {"message": "Period logged", "entry": entry}


@router.get("/{user_id}")
def get_cycle(user_id: str):
    """Retrieve cycle history and next-cycle predictions for the user."""
    history = get_cycle_history(user_id)
    prediction = predict_next_cycle(history)
    return {"history": history, "prediction": prediction}
