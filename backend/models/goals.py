from pydantic import BaseModel
from typing import Optional


class GoalRequest(BaseModel):
    clerk_id: str
    title: str                         # "Save ₹10,000"
    category: str                      # "Finance" | "Health" | "Learning" | "Skills" | "Personal"
    icon: Optional[str] = "🎯"
    target: Optional[str] = "100"     # kept as string — DynamoDB Decimal issues
    current: Optional[str] = "0"      # current progress value
    due_date: Optional[str] = ""       # "June 30" or ISO date


class GoalUpdateRequest(BaseModel):
    clerk_id: str
    goal_id: str
    current: str                       # updated progress value
    is_completed: Optional[bool] = False
