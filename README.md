# Gut Feeling

A real-time chat companion for Crohn's Disease patients, featuring **Nurse Bubbles** — a fermentation-obsessed kombucha culture who answers health questions with bubbly enthusiasm.

## System Architecture

```
┌─────────────────────┐         ┌──────────────────────────────────┐         ┌─────────────┐
│                     │  REST   │                                  │         │             │
│   React Native      │────────>│  GET /api/messages?user_id=X     │         │             │
│   (Expo)            │         │                                  │  SQL    │ PostgreSQL  │
│                     │  WS     │  WS  /ws/{user_id}               │────────>│ 17          │
│   /client           │<──────> │                                  │         │             │
│                     │         │  FastAPI Server                  │         │             │
└─────────────────────┘         │                                  │         └─────────────┘
                                │  ┌────────────────────────────┐  │
                                │  │ Nurse Bubbles              │  │
                                │  │ (keyword matching engine)  │  │
                                │  └────────────────────────────┘  │
                                └──────────────────────────────────┘
```

### Data Flow

1. **On app load** — Client fetches conversation history via `GET /api/messages?user_id=X`
2. **Real-time chat** — Client connects to `WS /ws/{user_id}` for live messaging
3. **Message cycle** — User sends message → server persists it → sends typing indicator → generates bot response → persists bot message → sends bot message back

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React Native (Expo), TypeScript |
| Backend     | Python, FastAPI                |
| Database    | PostgreSQL 17                  |
| Real-time   | WebSockets (native FastAPI)    |
| Containers  | Docker Compose                 |

## Server Architecture

```
server/
├── Dockerfile
├── init.sql                        # DB schema (auto-runs on first compose up)
├── mypy.ini                        # Strict type checking
├── requirements.txt
├── requirements-test.txt
├── app/
│   ├── main.py                     # App entry — lifespan, CORS, router wiring
│   ├── config.py                   # Settings via pydantic-settings
│   ├── database.py                 # Async SQLAlchemy engine + session
│   ├── controllers/
│   │   ├── health.py               # GET /health
│   │   ├── messages.py             # GET /api/messages — conversation history
│   │   └── chat.py                 # WS /ws/{user_id} — real-time chat
│   ├── models/
│   │   ├── base.py                 # SQLAlchemy DeclarativeBase
│   │   └── message.py              # Message ORM model
│   ├── schemas/
│   │   └── message.py              # Pydantic models (MessageOut, WebSocketMessageIn)
│   └── services/
│       ├── chatbot.py              # Nurse Bubbles personality engine
│       └── connection_manager.py   # WebSocket connection tracker per user
└── tests/                          # pytest test suite (mirrors app/ structure)
    ├── conftest.py                 # In-memory SQLite fixtures, async test client
    ├── controllers/
    │   ├── test_messages.py        # REST endpoint tests
    │   └── test_chat.py           # WebSocket flow tests
    └── services/
        ├── test_chatbot.py         # Keyword matching + persona tests
        └── test_connection_manager.py
```

### Architectural Decisions

**Why FastAPI** — Async-native with first-class WebSocket support built on Starlette. Pydantic integration provides automatic request/response validation. Auto-generated OpenAPI docs at `/docs`.

**Why PostgreSQL** — Structured message data fits relational storage. ACID compliance ensures no messages are lost — important for a healthcare-adjacent app. Async access via asyncpg.

**Why persist-first WebSocket** — Both user and bot messages are saved to the database before the response is sent back. If the connection drops mid-response, no data is lost.

### API Endpoints

| Method | Path                        | Description                        |
|--------|-----------------------------|------------------------------------|
| GET    | `/health`                   | Health check                       |
| GET    | `/api/messages?user_id=X`   | Fetch conversation history         |
| WS     | `/ws/{user_id}`             | Real-time chat connection          |

### WebSocket Message Types

**Server → Client:**
| Type        | Description                      |
|-------------|----------------------------------|
| `connected` | Connection established           |
| `typing`    | Bot is generating a response     |
| `message`   | New message (user echo or bot)   |
| `error`     | Invalid message format           |

**Client → Server:**
```json
{ "content": "your message here", "user_id": "user-alice" }
```

## Chatbot Persona: Nurse Bubbles

A fermentation-obsessed kombucha culture who relates everything to gut health. Covers 8 topic groups via keyword matching:

- **Medication** — SCOBY feeding analogies
- **Side effects** — fermentation process metaphors
- **Diet** — gut culture nourishment tips
- **Flares/symptoms** — pH balance comparisons
- **Dosage/schedule** — brewing cycle analogies
- **Greetings** — bubbly introductions
- **Gratitude** — fizzy affirmations
- **Stress/anxiety** — gut-brain connection via fermentation

Off-topic questions get a gentle redirect back to gut health, staying fully in character.

## Setup & Run

### Prerequisites
- Docker with Compose plugin (`docker compose`)

### Quick Start

```bash
# Start PostgreSQL + FastAPI server
docker compose up --build

# Server available at http://localhost:8000
# API docs at http://localhost:8000/docs
# Health check: curl http://localhost:8000/health
```

## Features

- [x] REST API for conversation history
- [x] WebSocket real-time chat
- [x] Nurse Bubbles chatbot personality
- [x] Multi-user support (separate histories)
- [x] Docker Compose orchestration
- [x] Strict mypy type checking
- [ ] React Native client
- [ ] Connection status indicators
- [ ] Typing indicator animation
- [ ] User switcher UI
