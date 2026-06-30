"""
seed_demo.py — Realistic seed data for Pocket Buddy demo user.

Target user: Rahul Sharma (user_3F7niRrmZHpjlevsAbckiPzLww2)
  22-year-old male engineering student from Prayagraj.
  Interests: fitness, personal finance, journaling, technology.

Run:
  cd backend
  python seed2.py

Safe to run multiple times — uses fixed IDs where possible and
put_item overwrites on the same key, so no duplicates accumulate.
"""

import boto3
import os
import uuid
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

# ─── AWS connection ───────────────────────────────────────────────────
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

USER_ID  = "user_3F7niRrmZHpjlevsAbckiPzLww2"
NOW      = datetime.now(timezone.utc)


def days_ago(n: int) -> datetime:
    return NOW - timedelta(days=n)


def iso(dt: datetime) -> str:
    return dt.isoformat()


def date_str(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d")


# ═══════════════════════════════════════════════════════════════════════
# 👤  USER PROFILE
# ═══════════════════════════════════════════════════════════════════════

def seed_user():
    users_table.put_item(Item={
        "userId":     USER_ID,
        "clerk_id":   USER_ID,
        "name":       "Rahul Sharma",
        "email":      "rahul.sharma@example.com",
        "age":        "22",
        "gender":     "Male",
        "phone":      "9876543210",
        "status":     "Student",
        "friend_name": "Nova",
        "occupation": "Engineering Student",
        "city":       "Prayagraj",
        "goals_list": ["Save money", "Improve fitness", "Learn full-stack development"],
        "emergency_contact": "Suresh Sharma",
        "relationship":      "Father",
        "emergency_phone":   "9876500001",
    })
    print("✅  User profile upserted.")


# ═══════════════════════════════════════════════════════════════════════
# 📓  JOURNAL ENTRIES  (18 entries over the last 30 days)
# ═══════════════════════════════════════════════════════════════════════

JOURNAL_DATA = [
    # (days_ago, mood, text, tags)
    (1,  "Good",    "Finally cracked the two-pointer problem I was stuck on for 3 days! Feels great when the approach clicks. Need to practice more sliding-window patterns tomorrow.", ["DSA", "College"]),
    (2,  "Okay",    "Skipped the gym today — had a late-night debugging session for the college project API. Ordering from Swiggy again felt like a waste but I was exhausted.", ["Fitness", "College", "Stress"]),
    (3,  "Great",   "5K run in the morning before lectures. Beat my previous time by 40 seconds. Body feels strong. Diet has been clean this week too.", ["Fitness", "Health"]),
    (4,  "Okay",    "Spent too much on food delivery this week. Need to meal-prep on Sundays. Counted the Swiggy orders and it was 5 this week alone — that's like ₹1,500 gone.", ["Money", "Health"]),
    (5,  "Good",    "Started the React module on Udemy. State management is making more sense now. Built a small Todo app as practice. Side projects feel more meaningful than assignments.", ["Learning", "Goals"]),
    (7,  "Bad",     "Woke up late, missed morning workout. Feeling unproductive. DSA revision session went badly — blanked on graph traversal. Tomorrow will be better.", ["DSA", "Stress"]),
    (8,  "Good",    "Team presentation went really well! Professor appreciated our database design approach. The work we put in over the weekend paid off.", ["College", "Goals"]),
    (10, "Great",   "Gym streak: 5 days in a row! Hit a new personal record on bench press — 65 kg. The consistency is starting to show. Arms definitely bigger.", ["Fitness", "Health"]),
    (12, "Okay",    "Received stipend from the freelance gig — ₹3,000. Not a lot but feels good to earn something. Transferred ₹1,000 to savings immediately.", ["Money", "Goals"]),
    (13, "Good",    "Solved 3 LeetCode mediums in a row without hints. Topics: BFS, binary search, and DP. Feeling confident about placement season prep.", ["DSA", "College"]),
    (15, "Terrible","Really low day. Comparison trap hit hard — a friend got a 30 LPA offer and I'm still grinding basics. Need to focus on my own timeline.", ["Mental Health", "Stress"]),
    (16, "Okay",    "Talked to Nova (AI) about feeling stuck. It helped reframe things — every expert was once a beginner. Went for a walk, felt better.", ["Mental Health", "Goals"]),
    (18, "Good",    "Sunday meal prep done! Rice, dal, vegetables for 3 days. Should cut Swiggy spend significantly this week. Proud of the discipline.", ["Health", "Money"]),
    (20, "Great",   "Completed the backend REST API for the college capstone project. FastAPI + DynamoDB working smoothly. Feels like real production code.", ["College", "Learning", "Goals"]),
    (22, "Good",    "Morning gym + evening DSA session. 8 hours sleep last night — the best in 2 weeks. Energy levels noticeably better. Sleep is underrated.", ["Fitness", "Health"]),
    (24, "Okay",    "Monthly budget review: spent ₹6,200 this month. Need to bring it under ₹5,500 next month. Food delivery and weekend outings are the biggest leaks.", ["Money", "Goals"]),
    (26, "Good",    "Helped a junior with their OOP assignment. Explaining concepts forces me to understand them better. Teaching is learning.", ["College", "Learning"]),
    (29, "Great",   "Got selected for the college hackathon team! We're building a health tracking app — ironically similar to what I use daily. Excited for it.", ["College", "Goals", "Learning"]),
]

def seed_journals() -> int:
    count = 0
    for i, (d, mood, text, tags) in enumerate(JOURNAL_DATA):
        ts = days_ago(d)
        journal_table.put_item(Item={
            "userId":    USER_ID,
            "entry_id":  f"seed-journal-{i+1:02d}",   # fixed ID → idempotent
            "timestamp": iso(ts),
            "mood":      mood,
            "text":      text,
            "tags":      tags,
        })
        count += 1
    print(f"✅  {count} journal entries upserted.")
    return count


# ═══════════════════════════════════════════════════════════════════════
# 💰  TRANSACTIONS  (45 entries over the last 30 days)
# ═══════════════════════════════════════════════════════════════════════

TRANSACTION_DATA = [
    # (days_ago, name, amount, category, type)
    # --- Income ---
    (0,  "Freelance Web Project",     "3000",  "Income",        "income"),
    (15, "Pocket Money from Dad",     "2500",  "Income",        "income"),
    (28, "Previous Month Savings",    "1500",  "Income",        "income"),

    # --- Food (heavy Swiggy pattern) ---
    (1,  "Swiggy – Burger King",      "320",   "Food",          "expense"),
    (1,  "Campus Canteen",            "85",    "Food",          "expense"),
    (2,  "Zomato – Biryani",          "280",   "Food",          "expense"),
    (3,  "Swiggy – Domino's",         "450",   "Food",          "expense"),
    (4,  "Campus Canteen",            "70",    "Food",          "expense"),
    (5,  "Grocery – Big Bazaar",      "680",   "Food",          "expense"),
    (6,  "Swiggy – Chinese",          "310",   "Food",          "expense"),
    (7,  "Campus Canteen",            "90",    "Food",          "expense"),
    (8,  "Zomato – Pizza",            "399",   "Food",          "expense"),
    (9,  "Swiggy – Rolls",            "180",   "Food",          "expense"),
    (10, "Campus Canteen",            "75",    "Food",          "expense"),
    (11, "Swiggy – Thali",            "260",   "Food",          "expense"),
    (13, "Campus Canteen",            "85",    "Food",          "expense"),
    (14, "Grocery – Local Market",    "520",   "Food",          "expense"),
    (16, "Swiggy – Burger",           "290",   "Food",          "expense"),
    (18, "Campus Canteen",            "80",    "Food",          "expense"),
    (20, "Zomato – Pasta",            "340",   "Food",          "expense"),
    (22, "Campus Canteen",            "90",    "Food",          "expense"),
    (24, "Grocery – Big Bazaar",      "710",   "Food",          "expense"),
    (27, "Swiggy – Paneer Roll",      "220",   "Food",          "expense"),

    # --- Transport ---
    (2,  "Ola Auto",                  "120",   "Transport",     "expense"),
    (5,  "Rapido Bike",               "65",    "Transport",     "expense"),
    (9,  "Bus Pass Recharge",         "200",   "Transport",     "expense"),
    (14, "Ola Auto",                  "140",   "Transport",     "expense"),
    (19, "Rapido Bike",               "80",    "Transport",     "expense"),
    (25, "Ola Auto",                  "110",   "Transport",     "expense"),

    # --- Education ---
    (4,  "Udemy – React Course",      "499",   "Education",     "expense"),
    (12, "Striver SDE Sheet Book",    "350",   "Education",     "expense"),
    (20, "LeetCode Premium",          "249",   "Education",     "expense"),
    (26, "GeeksForGeeks Subscription","199",   "Education",     "expense"),

    # --- Fitness ---
    (1,  "Gym Monthly Fee",           "800",   "Fitness",       "expense"),
    (8,  "Protein Powder",            "1200",  "Fitness",       "expense"),
    (18, "Gym Gloves",                "350",   "Fitness",       "expense"),
    (28, "Running Shoes",             "1499",  "Fitness",       "expense"),

    # --- Shopping ---
    (6,  "Amazon – Earphones",        "799",   "Shopping",      "expense"),
    (15, "Myntra – T-Shirts x2",      "698",   "Shopping",      "expense"),
    (22, "Amazon – USB Hub",          "399",   "Shopping",      "expense"),

    # --- Entertainment ---
    (3,  "Netflix Subscription",      "199",   "Entertainment", "expense"),
    (10, "Spotify Premium",           "119",   "Entertainment", "expense"),
    (17, "Cinema – Kalki 2898 AD",    "320",   "Entertainment", "expense"),
    (24, "Spotify Premium",           "119",   "Entertainment", "expense"),
]

def seed_transactions() -> int:
    count = 0
    for i, (d, name, amount, category, t_type) in enumerate(TRANSACTION_DATA):
        ts = days_ago(d)
        money_table.put_item(Item={
            "userId":         USER_ID,
            "transaction_id": f"seed-txn-{i+1:03d}",   # fixed ID → idempotent
            "date":           iso(ts),
            "name":           name,
            "amount":         amount,
            "category":       category,
            "type":           t_type,
        })
        count += 1
    print(f"✅  {count} transactions upserted.")
    return count


# ═══════════════════════════════════════════════════════════════════════
# ❤️  HEALTH LOGS  (30 days)
# ═══════════════════════════════════════════════════════════════════════

import random
random.seed(42)  # deterministic

def _health_for_day(day_offset: int) -> dict:
    """Generate realistic health data. Patterns:
    - Better sleep on weekends (Sat/Sun)
    - Higher steps on gym days (Mon/Wed/Fri/Sat)
    - Slightly less sleep near deadline days (offset 10-14)
    """
    dt = days_ago(day_offset)
    weekday = dt.weekday()  # 0=Mon … 6=Sun
    is_weekend = weekday >= 5
    is_gym_day = weekday in (0, 2, 4, 5)
    is_deadline_week = 10 <= day_offset <= 14

    sleep = round(random.uniform(7.5, 8.5) if is_weekend
                  else (random.uniform(5.5, 6.5) if is_deadline_week
                        else random.uniform(6.0, 7.5)), 1)

    steps = random.randint(8000, 12000) if is_gym_day else random.randint(4000, 7000)

    water = random.randint(6, 8) if is_gym_day else random.randint(4, 6)

    hr    = random.randint(62, 72)
    bmi   = str(round(random.uniform(22.1, 22.8), 1))

    habits = {
        "morning_walk": is_gym_day,
        "meditate":     random.random() > 0.5,
        "no_junk_food": random.random() > 0.4,
        "exercise":     is_gym_day,
        "sleep_by_11":  is_weekend or not is_deadline_week,
    }

    return {
        "userId":        USER_ID,
        "date":          date_str(dt),          # sort key
        "sleep_hours":   str(sleep),
        "steps":         str(steps),
        "water_glasses": str(water),
        "heart_rate":    str(hr),
        "bmi":           bmi,
        "habits":        habits,
        "updated_at":    iso(dt),
    }

def seed_health() -> int:
    count = 0
    for day in range(30):
        health_table.put_item(Item=_health_for_day(day))
        count += 1
    print(f"✅  {count} health log entries upserted.")
    return count


# ═══════════════════════════════════════════════════════════════════════
# 🎯  GOALS
# ═══════════════════════════════════════════════════════════════════════

GOALS_DATA = [
    # (goal_id_suffix, title, category, target, current, due_date, is_completed)
    ("g1", "Save ₹10,000",              "Finance",  "10000", "3500",  "2025-12-31", False),
    ("g2", "Solve 150 LeetCode",        "Learning", "150",   "67",    "2025-09-30", False),
    ("g3", "Gym 20 Days This Month",    "Health",   "20",    "14",    "2025-06-30", False),
    ("g4", "Complete React Course",     "Learning", "100",   "72",    "2025-07-15", False),
    ("g5", "Run 5K Under 28 Minutes",   "Health",   "28",    "29",    "2025-08-31", False),
    ("g6", "Read 6 Books This Year",    "Personal", "6",     "2",     "2025-12-31", False),
    ("g7", "Finish College Project API","Learning", "100",   "100",   "2025-05-31", True),
    ("g8", "Zero Swiggy Week",          "Finance",  "7",     "7",     "2025-05-25", True),
]

def seed_goals() -> int:
    count = 0
    for suffix, title, category, target, current, due_date, is_completed in GOALS_DATA:
        goals_table.put_item(Item={
            "userId":       USER_ID,
            "goal_id":      f"seed-{suffix}",
            "title":        title,
            "category":     category,
            "icon":         "🎯",
            "target":       target,
            "current":      current,
            "due_date":     due_date,
            "is_completed": is_completed,
            "created_at":   iso(days_ago(30)),
        })
        count += 1
    print(f"✅  {count} goals upserted.")
    return count


# ═══════════════════════════════════════════════════════════════════════
# 🚀  MAIN
# ═══════════════════════════════════════════════════════════════════════

def main():
    print(f"\n{'='*55}")
    print(f"  Pocket Buddy — Seed Script v2")
    print(f"  Target user: {USER_ID}")
    print(f"{'='*55}\n")

    seed_user()
    j = seed_journals()
    t = seed_transactions()
    h = seed_health()
    g = seed_goals()

    print(f"\n{'─'*55}")
    print(f"  Summary")
    print(f"  Journals created  : {j}")
    print(f"  Transactions      : {t}")
    print(f"  Health log days   : {h}")
    print(f"  Goals             : {g}")
    print(f"  Total records     : {j + t + h + g + 1}")
    print(f"{'─'*55}")
    print(f"\n✅  Seed complete! Log in as Rahul to see the data.\n")


if __name__ == "__main__":
    main()
