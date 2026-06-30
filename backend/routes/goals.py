from fastapi import APIRouter, HTTPException
from models.goals import GoalRequest, GoalUpdateRequest
from services.dynamodb import create_goal, get_goals, update_goal_progress

router = APIRouter()

@router.post("/")
def save_goal(data: GoalRequest):
    item = data.model_dump()
    item["userId"] = item.pop("clerk_id")
    goal = create_goal(item)
    return {"message": "Goal created", "goal": goal}

@router.get("/{user_id}")
def list_goals(user_id: str):
    goals = get_goals(user_id)
    return {"goals": goals}

@router.patch("/update")
@router.post("/update")
def update_goal(data: GoalUpdateRequest):
    """Update a goal's completion status."""
    try:
        updated = update_goal_progress(
            data.clerk_id,
            data.goal_id,
            data.current,
            data.is_completed
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Goal not found")
        return {"message": "Goal updated", "goal": updated}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[GOALS] Update error for user={data.clerk_id}, goal={data.goal_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))