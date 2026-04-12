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
│   ├── config.py                   # Settings via pydantic-settings (all values from env)
│   ├── database.py                 # Async SQLAlchemy engine + session
│   ├── controllers/
│   │   ├── health.py               # GET /health
│   │   ├── messages.py             # GET /api/messages — conversation history (auth required)
│   │   └── chat.py                 # WS /ws/{user_id} — real-time chat (auth required)
│   ├── models/
│   │   ├── base.py                 # SQLAlchemy DeclarativeBase
│   │   └── message.py              # Message ORM model
│   ├── schemas/
│   │   └── message.py              # Pydantic models (MessageOut, WebSocketMessageIn)
│   └── services/
│       ├── auth.py                 # Bearer token + WebSocket token verification
│       ├── chatbot.py              # Nurse Bubbles personality engine
│       └── connection_manager.py   # WebSocket connection tracker per user
└── tests/                          # pytest test suite (mirrors app/ structure)
    ├── conftest.py                 # In-memory SQLite fixtures, async test clients (auth + unauth)
    ├── controllers/
    │   ├── test_messages.py        # REST endpoint tests incl. auth boundary
    │   └── test_chat.py           # WebSocket flow + auth rejection tests
    └── services/
        ├── test_chatbot.py         # Keyword matching + persona tests
        └── test_connection_manager.py
```

### Architectural Decisions

**Why FastAPI** — Async-native with first-class WebSocket support built on Starlette. Pydantic integration provides automatic request/response validation. Auto-generated OpenAPI docs at `/docs`.

**Why PostgreSQL** — Structured message data fits relational storage. ACID compliance ensures no messages are lost — important for a healthcare-adjacent app. Async access via asyncpg.

**Why persist-first WebSocket** — Both user and bot messages are saved to the database before the response is sent back. If the connection drops mid-response, no data is lost.

### API Endpoints

| Method | Path                                         | Auth required | Description                |
|--------|----------------------------------------------|---------------|----------------------------|
| GET    | `/health`                                    | No            | Health check               |
| GET    | `/api/messages?user_id=X`                    | Bearer token  | Fetch conversation history |
| WS     | `/ws/{user_id}?token=<token>`                | Query token   | Real-time chat connection  |

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
{ "content": "your message here" }
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

## Client Architecture

```
client/
├── App.tsx                             # Entry point — SafeAreaProvider + ChatProvider
├── src/
│   ├── types.ts                        # Message, ConnectionStatus, WebSocket event types
│   ├── config.ts                       # API/WS URLs (platform-aware), user list
│   ├── api.ts                          # REST client — fetchMessages()
│   ├── hooks/
│   │   └── useWebSocket.ts             # WebSocket hook with auto-reconnect + backoff
│   ├── context/
│   │   └── ChatContext.tsx              # Lifted state provider — messages, user, actions
│   ├── components/
│   │   ├── MessageBubble.tsx           # Memo'd bubble (bot=amber/left, user=teal/right)
│   │   ├── TypingIndicator.tsx         # Animated 3-dot bounce indicator
│   │   ├── ConnectionStatusBanner.tsx  # Color-coded status banner
│   │   ├── UserSwitcher.tsx            # Alice/Bob toggle
│   │   └── ChatInput.tsx               # Text input + send button
│   └── screens/
│       └── ChatScreen.tsx              # Main screen — FlashList, keyboard handling
```

### Frontend Patterns

- **FlashList** over FlatList for performant message rendering
- **Memo'd list items** with primitive-only props to avoid unnecessary re-renders
- **Pressable** over TouchableOpacity for press interactions
- **Lifted state** via React Context with `{ state, actions }` interface
- **Functional setState** to avoid stale closures in async callbacks
- **Exponential backoff** WebSocket reconnect (caps at 16s)
- **Message deduplication** by ID when appending from WebSocket

## Setup & Run

### Prerequisites
- Docker with Compose plugin (`docker compose`)

### 1. Configure environment variables

Secrets are split across two `.env` files — one for the backend, one for the Expo client.

**Backend** (project root):
```bash
cp .env.example .env
```
Edit `.env` and set at minimum:
```ini
POSTGRES_PASSWORD=your-db-password
API_TOKEN=your-api-token
```

**Expo client** (`client/`):
```bash
cp client/.env.example client/.env
```
Edit `client/.env` and set the same token:
```ini
EXPO_PUBLIC_API_TOKEN=your-api-token   # must match API_TOKEN above
```

> Both `.env` files are gitignored and must never be committed.
> For production, replace `.env` with your secrets manager of choice —
> AWS Secrets Manager, Docker secrets, or inject env vars directly into
> your orchestrator (ECS task definition, Kubernetes secret, etc.).
> The code doesn't change, only where the values come from.

### 2. Start the backend

```bash
docker compose up --build
# Server:   http://localhost:8000
# API docs: http://localhost:8000/docs
# Health:   curl http://localhost:8000/health
```

### 3. Start the Expo client

```bash
cd client
npm install
npx expo start --clear
```

Scan the QR code with Expo Go (iOS/Android) or press `a` for Android emulator / `i` for iOS simulator.

### Running tests

```bash
cd server
pytest tests/ -v
```

Tests use an in-memory SQLite database and a fixed `test-token` — no running containers required.

## Features

- [x] REST API for conversation history
- [x] WebSocket real-time chat
- [x] Nurse Bubbles chatbot personality
- [x] Multi-user support (separate histories)
- [x] Docker Compose orchestration
- [x] Strict mypy type checking
- [x] React Native client (Expo + TypeScript)
- [x] Connection status indicators
- [x] Typing indicator animation
- [x] User switcher UI

---

## Security Considerations

### What is implemented

| # | Fix | Severity |
|---|-----|----------|
| Bearer token auth on `GET /api/messages` | Unauthenticated requests return 401 | HIGH |
| Token query-param auth on WebSocket (`?token=`) | Invalid token closes with 1008 Policy Violation | HIGH |
| CORS `allow_credentials=False` | Bearer tokens don't need cookie credentials; wildcard + credentials is invalid per spec | HIGH |
| PostgreSQL port not published to host | DB unreachable outside the Docker network | MEDIUM |
| WebSocket payload `user_id` removed | Server derives identity from path param only; client cannot spoof it | MEDIUM |
| Message content capped at 4 000 characters | Prevents memory exhaustion from oversized payloads | LOW |

Set the token via environment variable before starting:

```yaml
# docker-compose.yml → server → environment
API_TOKEN: "your-secret-token-here"
```

Client usage:
- **REST:** `Authorization: Bearer <token>` header
- **WebSocket:** `ws://host:8000/ws/<user_id>?token=<token>`

---

### What a production deployment still needs

#### 1. Replace the pre-shared token with JWT

A single shared secret gives every user the same credential — a leaked token compromises everyone. In production:

- Add `POST /api/login` that accepts credentials and returns a short-lived **JWT** (e.g. RS256, 15-minute access token + 7-day refresh token).
- The JWT `sub` claim carries the user ID. The server extracts it from the *verified* token instead of trusting the path parameter. This eliminates the IDOR class of bugs entirely — a user can only ever see their own messages.

```python
# The WS path becomes /ws (no user_id) — identity comes from the token
payload = jwt.decode(token, PUBLIC_KEY, algorithms=["RS256"])
user_id = payload["sub"]   # authoritative; client cannot forge this
```

#### 2. Enforce HTTPS / WSS (TLS in transit)

All traffic currently travels in **plaintext** over HTTP/WS. Health data (PHI) must be encrypted in transit (HIPAA Technical Safeguard §164.312(e)(1)). Put a TLS-terminating reverse proxy in front of the server:

```
# Caddy — automatic Let's Encrypt certificate
api.yourdomain.com {
    reverse_proxy server:8000
}
```

Switch the client from `http://` / `ws://` to `https://` / `wss://`.

#### 3. Restrict CORS to specific origins

`allow_origins=["*"]` lets any website call your API from a browser. Set this to your exact client origin(s):

```python
cors_origins: list[str] = ["https://app.yourdomain.com"]
```

#### 4. Rotate database credentials and use a secrets manager

The default credentials (`gutfeeling` / `gutfeeling`) are committed to source control. Before production: generate strong random credentials and inject them via a secrets manager (AWS Secrets Manager, HashiCorp Vault, Docker secrets) — never hardcoded in a file that gets committed.

#### 5. Store the client token in SecureStore

Use **Expo SecureStore** (backed by iOS Keychain / Android Keystore) — not `AsyncStorage`, which is unencrypted on-disk and readable on rooted devices:

```typescript
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('api_token', token);
const token = await SecureStore.getItemAsync('api_token');
```
