# CuraAI

CuraAI is an AI-powered personal wellness and life management platform designed to help users track their health, habits, emotions, goals, and financial well-being in one place. The app combines a modern React frontend with a FastAPI backend to provide a personalized digital companion experience.

## Overview

CuraAI helps users:
- Track daily wellness and personal habits
- Reflect on journaling and emotional well-being
- View insights across their life
- Manage financial wellness goals
- Receive AI-assisted guidance through a companion experience
- Complete onboarding and maintain a personalized profile

This project is structured as a full-stack application with:
- Frontend: React + Vite
- Backend: FastAPI
- Authentication: Clerk
- Data services: DynamoDB / Supabase
- AI integrations: OpenAI and Google Generative AI
- Deployment support: Vercel + Docker

## Features

### Core Features
- Personalized onboarding flow
- Secure sign-in and sign-up
- Life overview dashboard
- Wellness tracking
- Financial wellness dashboard
- Reflection and journaling tools
- Habit tracking
- Personal growth insights
- AI companion experience
- User settings and profile management

### AI & Insight Capabilities
- Smart guidance for personal wellness
- AI-powered support through companion routes
- Goal-oriented recommendations
- Data-driven insights dashboard

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Clerk Auth
- Axios
- Recharts
- Tailwind CSS
- Lucide Icons

### Backend
- Python
- FastAPI
- Pydantic
- Uvicorn
- AWS DynamoDB
- Supabase
- OpenAI
- Google Generative AI
- Python-dotenv

## Project Structure

```bash
CuraAI/
├── backend/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── companion.py
│   │   ├── cycle.py
│   │   ├── goals.py
│   │   ├── health.py
│   │   ├── journal.py
│   │   └── money.py
│   ├── services/
│   ├── models/
│   ├── utils/
│   ├── server.py
│   ├── requirements.txt
│   ├── db_config.py
│   ├── seed_data.py
│   └── seed_demo.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── README.md
├── docker-compose.yml
├── Dockerfile
├── index.html
├── vite.config.js
├── eslint.config.js
├── .gitignore
├── .vercelignore
└── README.md
