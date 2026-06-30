"""
dynamodb.py — DynamoDB service layer for all CRUD operations across tables.
"""

import boto3
import os
import uuid
from datetime import datetime, timezone
from boto3.dynamodb.conditions import Key
from dotenv import load_dotenv

load_dotenv()

# --- DynamoDB Resource & Table References ---

dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("AWS_REGION", "eu-north-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

users_table   = dynamodb.Table("CuraAI")
journal_table = dynamodb.Table("JournalEntries")
money_table   = dynamodb.Table("Money")
health_table  = dynamodb.Table("Health")
goals_table   = dynamodb.Table("Goals")
cycle_table   = dynamodb.Table("CycleTracker")


# ═══════════════════════════════════════════════════════════════════════
# 👤 USERS
# ═══════════════════════════════════════════════════════════════════════

def create_or_update_user(data: dict):
    """Create or overwrite a user profile in the Users table."""
    users_table.put_item(Item=data)
    return data


def get_user(user_id: str):
    """Retrieve a user profile by userId partition key."""
    response = users_table.get_item(Key={"userId": user_id})
    return response.get("Item")


# ═══════════════════════════════════════════════════════════════════════
# 📓 JOURNAL
# ═══════════════════════════════════════════════════════════════════════

def create_journal_entry(data: dict) -> dict:
    """Create a new journal entry with a generated ID and timestamp."""
    item = {
        "userId":    data["userId"],
        "entry_id":  str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "mood":      data.get("mood", "Okay"),
        "text":      data["text"],
        "tags":      data.get("tags", []),
    }
    journal_table.put_item(Item=item)
    return item


def get_journal_entries(user_id: str) -> list:
    """Retrieve all journal entries for a user, sorted by most recent first."""
    response = journal_table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    items = response.get("Items", [])
    return sorted(items, key=lambda x: x.get("timestamp", ""), reverse=True)


# ═══════════════════════════════════════════════════════════════════════
# 💰 MONEY / TRANSACTIONS
# ═══════════════════════════════════════════════════════════════════════

def create_transaction(data: dict) -> dict:
    """Create a new transaction (income or expense) with a generated ID."""
    item = {
        "userId":         data["userId"],
        "transaction_id": str(uuid.uuid4()),
        "date":           data.get("date") or datetime.now(timezone.utc).isoformat(),
        "name":           data["name"],
        "amount":         data["amount"],
        "category":       data["category"],
        "type":           data["type"],
    }
    money_table.put_item(Item=item)
    return item


def get_transactions(user_id: str) -> list:
    """Retrieve all transactions for a user, sorted by most recent first."""
    response = money_table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    items = response.get("Items", [])
    return sorted(items, key=lambda x: x.get("date", ""), reverse=True)


def add_transaction(user_id: str, amount: float, category: str, description: str, transaction_type: str = "expense"):
    """Quick-add a transaction from the AI companion's auto-detection."""
    item = {
        "userId":         user_id,
        "transaction_id": str(uuid.uuid4()),
        "date":           datetime.now(timezone.utc).isoformat(),
        "name":           description,
        "amount":         str(amount),
        "category":       category,
        "type":           transaction_type,
    }
    money_table.put_item(Item=item)


# ═══════════════════════════════════════════════════════════════════════
# ❤️ HEALTH
# ═══════════════════════════════════════════════════════════════════════

def save_health_log(data: dict) -> dict:
    """Save or overwrite today's health log for the user."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    item = {
        "userId":        data["userId"],
        "date":          data.get("date") or today,
        "sleep_hours":   data.get("sleep_hours", ""),
        "steps":         data.get("steps", ""),
        "water_glasses": data.get("water_glasses", ""),
        "heart_rate":    data.get("heart_rate", ""),
        "bmi":           data.get("bmi", ""),
        "habits":        data.get("habits", {}),
        "updated_at":    datetime.now(timezone.utc).isoformat(),
    }
    health_table.put_item(Item=item)
    return item


def get_health_logs(user_id: str, limit: int = 7) -> list:
    """Retrieve the most recent health logs for a user (default: last 7 days)."""
    response = health_table.query(
        KeyConditionExpression=Key("userId").eq(user_id),
        ScanIndexForward=False,
        Limit=limit
    )
    return response.get("Items", [])


def add_health_log(user_id: str, steps: int = None, calories: int = None, sleep_hours: float = None, note: str = ""):
    """Quick-add a health log from the AI companion's auto-detection."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    item = {
        "userId":        user_id,
        "date":          today,
        "steps":         str(steps) if steps is not None else "",
        "sleep_hours":   str(sleep_hours) if sleep_hours is not None else "",
        "water_glasses": "",
        "heart_rate":    "",
        "bmi":           "",
        "habits":        {},
        "updated_at":    datetime.now(timezone.utc).isoformat(),
    }
    health_table.put_item(Item=item)


# ═══════════════════════════════════════════════════════════════════════
# 🎯 GOALS
# ═══════════════════════════════════════════════════════════════════════

def create_goal(data: dict) -> dict:
    """Create a new goal with a generated ID and default progress."""
    item = {
        "userId":       data["userId"],
        "goal_id":      str(uuid.uuid4()),
        "title":        data["title"],
        "category":     data["category"],
        "icon":         data.get("icon", "🎯"),
        "target":       data.get("target", "100"),
        "current":      data.get("current", "0"),
        "due_date":     data.get("due_date", ""),
        "is_completed": False,
        "created_at":   datetime.now(timezone.utc).isoformat(),
    }
    goals_table.put_item(Item=item)
    return item


def get_goals(user_id: str) -> list:
    """Retrieve all goals for a user."""
    response = goals_table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    return response.get("Items", [])


def update_goal_progress(user_id: str, goal_id: str, current: str, is_completed: bool = False) -> dict:
    """Update a goal's current progress value and completion status."""
    # First fetch the existing item to preserve all fields
    existing = goals_table.get_item(
        Key={"userId": user_id, "goal_id": goal_id}
    ).get("Item")

    if not existing:
        return {}

    # Merge updated fields and write back
    existing["current"]      = current
    existing["is_completed"] = is_completed
    goals_table.put_item(Item=existing)
    return existing


# ═══════════════════════════════════════════════════════════════════════
# 🌸 CYCLE TRACKER
# partition key: userId  |  sort key: period_id
# ═══════════════════════════════════════════════════════════════════════

def log_period(user_id: str, start_date: str, end_date: str = None, symptoms: list = [], flow: str = "medium") -> dict:
    """Log a new period entry with optional end date, symptoms, and flow level."""
    item = {
        "userId":     user_id,
        "period_id":  str(uuid.uuid4()),
        "start_date": start_date,
        "end_date":   end_date or "",
        "symptoms":   symptoms,
        "flow":       flow,
        "logged_at":  datetime.now(timezone.utc).isoformat(),
    }
    cycle_table.put_item(Item=item)
    return item


def get_cycle_history(user_id: str) -> list:
    """Retrieve all period logs for a user, sorted by most recent start date."""
    response = cycle_table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    items = response.get("Items", [])
    return sorted(items, key=lambda x: x.get("start_date", ""), reverse=True)
