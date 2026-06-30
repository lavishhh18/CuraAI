from pydantic import BaseModel
from typing import Optional


class OnboardingRequest(BaseModel):
    clerk_id: str                              # Clerk user ID — partition key
    email: str                                 # from Clerk
    name: str
    age: Optional[str] = ""                    # kept as string to avoid DynamoDB Decimal issues
    phone: Optional[str] = ""
    gender: Optional[str] = ""
    status: Optional[str] = ""                 # "Student" | "Working"
    friend_name: Optional[str] = ""            # AI companion name
    emergency_contact: Optional[str] = ""
    relationship: Optional[str] = ""
    emergency_phone: Optional[str] = ""
