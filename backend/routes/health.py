"""
health.py — Health logging and retrieval routes (sleep, steps, water, habits).
"""

from fastapi import APIRouter
from models.health import HealthLogRequest
from services.dynamodb import save_health_log, get_health_logs
from datetime import datetime, timezone

router = APIRouter()


# --- Routes ---

@router.post("/")
def log_health(data: HealthLogRequest):
    """Save or update today's health log for the user."""
    item = data.model_dump()
    item["userId"] = item.pop("clerk_id")
    log = save_health_log(item)
    return {"message": "Health log saved", "log": log}


@router.get("/{user_id}/today")
def get_today_log(user_id: str):
    """Retrieve today's health log for the given user."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    logs = get_health_logs(user_id)
    today_log = next((l for l in logs if l.get("date", "").startswith(today)), None)
    return {"log": today_log}


@router.get("/{user_id}")
def list_health_logs(user_id: str):
    """Retrieve the most recent health logs (up to 7 days) for the given user."""
    logs = get_health_logs(user_id)
    return {"logs": logs}
