"""
auth.py — User authentication and profile management routes.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from services.dynamodb import create_or_update_user, get_user

router = APIRouter()


# --- Request Models ---

class OnboardingRequest(BaseModel):
    """Schema for onboarding form submission."""
    clerk_id: str
    email: str
    name: str
    age: str
    phone: str | None = None
    gender: str | None = None
    status: str | None = None
    friend_name: str
    emergency_contact: str
    relationship: str
    emergency_phone: str


# --- Routes ---

@router.post("/onboarding")
def onboard_user(data: OnboardingRequest):
    """Save or update user profile during onboarding."""
    item = data.dict()
    item["userId"] = item.pop("clerk_id")  # match DynamoDB partition key
    create_or_update_user(item)
    return {"message": "onboarding saved", "userId": item["userId"]}


@router.get("/profile/{clerk_id}")
def get_profile(clerk_id: str):
    """Retrieve a user profile by their Clerk ID."""
    profile = get_user(clerk_id)
    if not profile:
        return {}
    return profile
