"""
server.py — FastAPI application entry point with CORS configuration and route registration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.companion import router as companion_router
from routes.auth    import router as auth_router
from routes.journal import router as journal_router
from routes.money   import router as money_router
from routes.health  import router as health_router
from routes.goals   import router as goals_router
from routes.cycle   import router as cycle_router

load_dotenv()

app = FastAPI(title="CuraAI API")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Health check endpoint — confirms the backend is running."""
    return {"message": "CuraAI backend running 🚀"}


# --- Route Registration ---
app.include_router(auth_router,      prefix="/auth",      tags=["Auth"])
app.include_router(journal_router,   prefix="/journal",   tags=["Journal"])
app.include_router(money_router,     prefix="/money",     tags=["Money"])
app.include_router(health_router,    prefix="/health",    tags=["Health"])
app.include_router(goals_router,     prefix="/goals",     tags=["Goals"])
app.include_router(companion_router, prefix="/companion", tags=["Companion"])
app.include_router(cycle_router,     prefix="/cycle",     tags=["Cycle"])
