import boto3
import uuid
import os
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv

load_dotenv()

# CONFIG
USER_ID = "user_3F4SWrwE7X19nx06ObrzHbx8PCh"
AWS_REGION = os.getenv("AWS_REGION", "eu-north-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

dynamodb = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

journal_table = dynamodb.Table("JournalEntries")
money_table   = dynamodb.Table("Money")
health_table  = dynamodb.Table("Health")
goals_table   = dynamodb.Table("Goals")
cycle_table   = dynamodb.Table("CycleTracker")

def days_ago(n):
    return (datetime.now(timezone.utc) - timedelta(days=n)).isoformat()

def date_ago(n):
    return (datetime.now(timezone.utc) - timedelta(days=n)).strftime("%Y-%m-%d")

# ─── JOURNAL ────────────────────────────────────────────────────────────────
journal_entries = [
    {"mood": "Great",    "text": "Had an amazing productive day! Finished all my assignments early and went for a run. Feeling really good about my progress this week.", "tags": ["productive", "fitness"], "days": 0},
    {"mood": "Good",     "text": "Cooked a healthy meal today and tracked all my expenses. Small wins! Nova reminded me to drink more water.", "tags": ["health", "money"], "days": 1},
    {"mood": "Okay",     "text": "Bit tired from studying but managed to hit my step goal. Need to sleep earlier tonight.", "tags": ["study", "tired"], "days": 2},
    {"mood": "Great",    "text": "Got my internship stipend today! Immediately saved 30% as planned. Feeling financially responsible.", "tags": ["money", "savings"], "days": 3},
    {"mood": "Bad",      "text": "Skipped the gym and overspent on food delivery. Tomorrow will be better. Nova gave me a pep talk which helped.", "tags": ["struggle", "food"], "days": 4},
    {"mood": "Good",     "text": "Back on track. Meal prepped for the week and updated my budget. Feeling more in control.", "tags": ["meal-prep", "budget"], "days": 5},
    {"mood": "Great",    "text": "Completed a 7-day streak on my health goals! Never felt better. Nova celebrated with me.", "tags": ["streak", "health"], "days": 6},
    {"mood": "Good",     "text": "Long study session but got through it. Rewarded myself with a small treat staying within budget!", "tags": ["study", "reward"], "days": 8},
    {"mood": "Okay",     "text": "Rainy day vibes. Stayed in, journaled, and reflected on my monthly goals. Progress is slow but steady.", "tags": ["reflection", "goals"], "days": 10},
    {"mood": "Great",    "text": "Had a great call with family. Reminded me why I am working so hard. Feeling motivated and loved.", "tags": ["family", "motivation"], "days": 12},
]

print("Seeding journal entries...")
for e in journal_entries:
    journal_table.put_item(Item={
        "userId":    USER_ID,
        "entry_id":  str(uuid.uuid4()),
        "timestamp": days_ago(e["days"]),
        "mood":      e["mood"],
        "text":      e["text"],
        "tags":      e["tags"],
    })
print(f"  {len(journal_entries)} journal entries added")

# ─── MONEY ──────────────────────────────────────────────────────────────────
transactions = [
    {"name": "Internship Stipend",    "amount": "15000", "category": "income",        "type": "income",  "days": 1},
    {"name": "Grocery Shopping",      "amount": "850",   "category": "food",          "type": "expense", "days": 1},
    {"name": "Zomato - Dinner",       "amount": "320",   "category": "food",          "type": "expense", "days": 2},
    {"name": "Metro Card Recharge",   "amount": "500",   "category": "transport",     "type": "expense", "days": 2},
    {"name": "Netflix Subscription",  "amount": "199",   "category": "entertainment", "type": "expense", "days": 3},
    {"name": "Gym Membership",        "amount": "1200",  "category": "health",        "type": "expense", "days": 3},
    {"name": "Savings Transfer",      "amount": "4500",  "category": "savings",       "type": "expense", "days": 4},
    {"name": "Stationary and Books",  "amount": "650",   "category": "education",     "type": "expense", "days": 5},
    {"name": "Freelance Payment",     "amount": "3000",  "category": "income",        "type": "income",  "days": 6},
    {"name": "Coffee Shop",           "amount": "180",   "category": "food",          "type": "expense", "days": 6},
    {"name": "Electricity Bill",      "amount": "780",   "category": "utilities",     "type": "expense", "days": 7},
    {"name": "Online Course Udemy",   "amount": "499",   "category": "education",     "type": "expense", "days": 8},
    {"name": "Swiggy Lunch",          "amount": "250",   "category": "food",          "type": "expense", "days": 9},
    {"name": "Movie Tickets",         "amount": "400",   "category": "entertainment", "type": "expense", "days": 10},
    {"name": "Parents Transfer",      "amount": "2000",  "category": "income",        "type": "income",  "days": 12},
    {"name": "Pharmacy",              "amount": "340",   "category": "health",        "type": "expense", "days": 13},
    {"name": "Clothes Shopping",      "amount": "1500",  "category": "shopping",      "type": "expense", "days": 14},
    {"name": "Internet Bill",         "amount": "599",   "category": "utilities",     "type": "expense", "days": 15},
    {"name": "Birthday Dinner",       "amount": "800",   "category": "food",          "type": "expense", "days": 18},
    {"name": "Part-time Work",        "amount": "5000",  "category": "income",        "type": "income",  "days": 20},
]

print("Seeding money transactions...")
for t in transactions:
    money_table.put_item(Item={
        "userId":         USER_ID,
        "transaction_id": str(uuid.uuid4()),
        "date":           days_ago(t["days"]),
        "name":           t["name"],
        "amount":         t["amount"],
        "category":       t["category"],
        "type":           t["type"],
    })
print(f"  {len(transactions)} transactions added")

# ─── HEALTH ─────────────────────────────────────────────────────────────────
health_logs = [
    {"days": 0,  "steps": "8234",  "sleep": "7.5", "water": "6", "heart_rate": "72"},
    {"days": 1,  "steps": "10432", "sleep": "8.0", "water": "8", "heart_rate": "68"},
    {"days": 2,  "steps": "6100",  "sleep": "6.5", "water": "5", "heart_rate": "75"},
    {"days": 3,  "steps": "9800",  "sleep": "7.0", "water": "7", "heart_rate": "70"},
    {"days": 4,  "steps": "4200",  "sleep": "5.5", "water": "4", "heart_rate": "78"},
    {"days": 5,  "steps": "11200", "sleep": "8.5", "water": "8", "heart_rate": "65"},
    {"days": 6,  "steps": "9500",  "sleep": "7.5", "water": "7", "heart_rate": "69"},
    {"days": 7,  "steps": "7800",  "sleep": "7.0", "water": "6", "heart_rate": "71"},
    {"days": 8,  "steps": "8900",  "sleep": "6.5", "water": "5", "heart_rate": "73"},
    {"days": 9,  "steps": "12000", "sleep": "9.0", "water": "9", "heart_rate": "64"},
    {"days": 10, "steps": "5600",  "sleep": "6.0", "water": "4", "heart_rate": "76"},
    {"days": 11, "steps": "8100",  "sleep": "7.5", "water": "7", "heart_rate": "70"},
    {"days": 12, "steps": "9300",  "sleep": "8.0", "water": "8", "heart_rate": "67"},
    {"days": 13, "steps": "7400",  "sleep": "7.0", "water": "6", "heart_rate": "72"},
]

print("Seeding health logs...")
for h in health_logs:
    health_table.put_item(Item={
        "userId":        USER_ID,
        "date":          date_ago(h["days"]),
        "steps":         h["steps"],
        "sleep_hours":   h["sleep"],
        "water_glasses": h["water"],
        "heart_rate":    h["heart_rate"],
        "bmi":           "21.5",
        "habits":        {"exercise": True, "meditation": h["days"] % 2 == 0, "reading": h["days"] % 3 == 0},
        "updated_at":    days_ago(h["days"]),
    })
print(f"  {len(health_logs)} health logs added")

# ─── GOALS ──────────────────────────────────────────────────────────────────
goals = [
    {"title": "Save 50000 this year",      "category": "finance",  "icon": "savings",  "target": "50000", "current": "19500", "due_date": "2026-12-31"},
    {"title": "Walk 10000 steps daily",    "category": "health",   "icon": "steps",    "target": "30",    "current": "22",    "due_date": "2026-07-01"},
    {"title": "Read 12 books this year",   "category": "learning", "icon": "books",    "target": "12",    "current": "4",     "due_date": "2026-12-31"},
    {"title": "Complete Python course",    "category": "learning", "icon": "code",     "target": "100",   "current": "65",    "due_date": "2026-07-15"},
    {"title": "Drink 8 glasses water/day", "category": "health",   "icon": "water",    "target": "30",    "current": "18",    "due_date": "2026-07-01"},
    {"title": "No junk food for 30 days",  "category": "health",   "icon": "food",     "target": "30",    "current": "12",    "due_date": "2026-07-10"},
    {"title": "Build emergency fund",      "category": "finance",  "icon": "bank",     "target": "20000", "current": "8000",  "due_date": "2026-09-30"},
]

print("Seeding goals...")
for g in goals:
    goals_table.put_item(Item={
        "userId":       USER_ID,
        "goal_id":      str(uuid.uuid4()),
        "title":        g["title"],
        "category":     g["category"],
        "icon":         g["icon"],
        "target":       g["target"],
        "current":      g["current"],
        "due_date":     g["due_date"],
        "is_completed": False,
        "created_at":   days_ago(30),
    })
print(f"  {len(goals)} goals added")

# ─── CYCLE TRACKER ──────────────────────────────────────────────────────────
cycle_entries = [
    {"days_ago_start": 5,   "duration": 5, "flow": "medium", "symptoms": ["cramps", "bloating", "fatigue"]},
    {"days_ago_start": 33,  "duration": 6, "flow": "heavy",  "symptoms": ["cramps", "headache", "mood swings"]},
    {"days_ago_start": 61,  "duration": 5, "flow": "medium", "symptoms": ["bloating", "fatigue", "acne"]},
    {"days_ago_start": 89,  "duration": 4, "flow": "light",  "symptoms": ["cramps", "mood swings"]},
    {"days_ago_start": 117, "duration": 6, "flow": "heavy",  "symptoms": ["cramps", "bloating", "headache", "fatigue"]},
    {"days_ago_start": 145, "duration": 5, "flow": "medium", "symptoms": ["acne", "mood swings", "fatigue"]},
]

print("Seeding cycle tracker entries...")
for c in cycle_entries:
    start = datetime.now(timezone.utc) - timedelta(days=c["days_ago_start"])
    end   = start + timedelta(days=c["duration"])
    cycle_table.put_item(Item={
        "userId":     USER_ID,
        "period_id":  str(uuid.uuid4()),
        "start_date": start.strftime("%Y-%m-%d"),
        "end_date":   end.strftime("%Y-%m-%d"),
        "flow":       c["flow"],
        "symptoms":   c["symptoms"],
        "logged_at":  start.isoformat(),
    })
print(f"  {len(cycle_entries)} cycle entries added")

print("\nAll seed data inserted successfully!")
print(f"   User: {USER_ID}")
print(f"   Journal: {len(journal_entries)} entries")
print(f"   Money: {len(transactions)} transactions")
print(f"   Health: {len(health_logs)} logs")
print(f"   Goals: {len(goals)} goals")
print(f"   Cycle: {len(cycle_entries)} entries")