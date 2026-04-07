# Full Stack / React Native Challenge 🧑‍⚕️

Welcome, and thank you for your interest in joining mama health! This challenge simulates a real-world task where you need to quickly prototype a **mobile application** supported by a **robust, real-time backend**. It will test your ability to structure a project, handle real-time data flow, ensure a good user experience on mobile, and leverage modern backend tooling.

We respect your time and have designed this exercise to be completed in **3-6 hours**. Please don't feel the need to build a perfect, production-ready system. We're most interested in your **architectural approach**, your **design decisions**, and how you integrate different technologies to deliver a functional and delightful user experience.

Good luck! ✨

---

## The Business Context 🎯

PharmaCorp, a pharmaceutical company launching a new Crohn's Disease biologic. The companies focus is on **patient engagement and adherence**. They know that starting a new, complex treatment like a biologic can be overwhelming. Patients often have a stream of small, non-urgent questions ("Can I drink coffee after my injection?", "What do I do if I forget my dose by a few hours?").

PharmaCorp wants to prototype a secure, always-available digital companion to help patients feel supported. They envision a **conversational AI interface** that can answer simple, common questions about Crohn's Disease management, treatment logistics, and side effects.

**The core requirement is a simple, highly reliable mobile chat interface.**

---

## Your Mission 🚀

Your mission is to build a minimal, functional **real-time chat application** using **React Native (via Expo)** for the frontend and a custom backend for the conversation logic and persistence.

The application must demonstrate competency in three key areas:
1.  **Mobile Development (React Native/Expo):** A single-screen, usable chat interface.
2.  **Backend Architecture:** A service that can handle both persistent (REST) and real-time (WebSocket) communication.
3.  **Chatbot Personality & Logic:** A simple, engaging, and non-derailing chatbot personality.

---

## The Technology Stack 🛠️

* **Frontend:** React Native (Expo)
* **Backend:** A technology of your choice (e.g., Python/FastAPI, Node.js/Express, Go/Gin)
    * **Real-time:** WebSockets
    * **Conversation History:** REST API
* **Database/Persistence:** A containerized database of your choice (e.g., PostgreSQL, MongoDB, SQLite).
* **Containerization:** `docker-compose` to manage the database and backend services.

---

## Core Tasks ✅

### 1. Project Setup & Architecture

-   Create a single, monorepo structure containing the React Native app (`/client`) and the backend service (`/server`).
-   Write a `docker-compose.yml` file to spin up your chosen database and your backend application.
    -   **Side Note:** If working on Windows, ensure your `docker-compose` volumes and scripts are configured to work correctly in a Linux/container environment (e.g., correct line endings, permissions).

### 2. The Backend Chat Service

The backend must fulfill two roles:

* **REST API:** Expose an endpoint (e.g., `/api/messages`) to **fetch the entire conversation history** for a single, hardcoded user/session. This should be the first call the mobile app makes on load.
* **WebSocket Server:** Handle the live chat.
    * When a user sends a message via the WebSocket, the server should process it, generate a response, **persist both messages (user & bot)** to the database, and then broadcast the bot's response back to the client via the WebSocket.

### 3. The React Native Client

-   Develop a single-screen Expo app showing a simple chat UI.
-   When the app loads, it must first **fetch the conversation history** via the REST API.
-   The app must then establish a **WebSocket connection** to handle all new incoming and outgoing messages in real-time.
-   Implement a basic message input and display area.

### 4. Chatbot Personality (Extra Points)

-   Create a chatbot with a specific, **funny, and non-derailing premise**. For example:
    * "**Dr. Squiggles, The Overly Enthusiastic Goldfish**": A chatbot that only answers health/Crohn's related questions but frames every answer with extreme, almost alarming enthusiasm and uses goldfish-related analogies (e.g., "That's a fantastic question! You're swimming in the right direction!").
-   The bot's responses can be simple pre-programmed rules (e.g., pattern matching on keywords like "side effect" or "dosage"). The key is maintaining the character.

### 5. UI (Extra Points)

- Make the UI nice to look at. Strive away from the results Lovable, Claude or Gemini produce.

---

## What We're Looking For 🌟

-   **Architectural Clarity:** A clean separation between client and server, and a logical flow between REST (bootstrapping/history) and WebSockets (real-time).
-   **React Native Proficiency:** Your ability to set up a quick, clean Expo project and handle state and UI (e.g., scrolling to the latest message).
-   **Full-Stack Integration:** Correct implementation of networking logic (fetching from REST, connecting to WS) and deployment via `docker-compose`.
-   **Code Quality:** Clean, well-typed (e.g., TypeScript for RN, typing in your backend language), and easily understandable code.
-   **Creativity and Engagement:** The quality and consistency of your chatbot's personality. Can the premise successfully prevent the bot from derailing into generic chat?
-   **Smart user of AI:** Be as productive as possible, but
don't just rely on the AI.
---

## Deliverables 📦

Please submit a link to your forked and completed GitHub repository. **Keep the repository private** and send an invite to **johannes.unruh@mamahealth.io** (tj-mm) and **lorenzo.famiglini@mamahealth.io** (lollomamahealth) and a short notification email to **rebecca.looschelders@mamahealth.io**.

The repository should contain:

1.  Use `git` properly. Your repo should have more than one commit. Document your progress.
2.  **`/client`** directory - The complete React Native (Expo) application.
2.  **`/server`** directory - The complete backend service code.
3.  **`docker-compose.yml`** - To run the database and backend.
4.  **`README.md`** - Updated with your final analysis, including:
    * **System Diagram:** A simple diagram showing the data flow (Client -> REST/WS -> Server -> DB).
    * **Architectural Decisions:** Explain your choices (e.g., Why this database? Why this backend framework? How did you handle WS persistence?).
    * **Chatbot Persona:** Describe your chatbot's premise and how you enforced its personality to prevent derailing.
    * **Setup/Run Instructions:** Clear steps on how to start the `docker-compose` and run the Expo client.

---

## Optional "Go the Extra Mile" Tasks 🚀

Have extra time? Want to impress us further? Consider one of the following (these are **completely optional**):

-   **Error Handling & State Management:** Implement robust connection status indicators in the mobile app (e.g., "Connecting...", "Disconnected").
-   **UX Refinements:** Add a "typing indicator" on the client side when the server is processing a response, or optimize the flat list for performance.
-   **Security Consideration:** Briefly discuss how you would secure the WebSocket connection (e.g., token-based authentication) in a production environment.
-   **Multi-User Mock:** Modify the API/DB to support two distinct, hardcoded users, fetching and displaying separate conversation histories based on a simple mock user ID.
