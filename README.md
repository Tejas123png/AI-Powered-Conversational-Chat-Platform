# NovaMind - AI Conversational Chat Platform

NovaMind is a full-stack conversational AI application inspired by ChatGPT. It connects a React front end to an Express and MongoDB backend, powered by Google's Gemini models for fast, context-aware responses.

---

## Key Features

- **Contextual AI Chat**: Multi-turn conversation support with real-time markdown rendering and code syntax highlighting.
- **Secure Authentication**: User sign-up and login with password hashing (bcrypt) and HTTP-only JWT cookies.
- **Private Conversations**: Thread history is isolated per user; each user can create, rename, and delete their own chats.
- **Clean Interface**: Polished dark theme, responsive sidebar navigation, and interactive visual accents.
- **Deployment Ready**: Configured for unified hosting on platforms like Render or Railway, or separate deployment via Vercel.

---

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Three.js, React Markdown, Highlight.js
- **Backend**: Node.js (ES Modules), Express 5
- **Database**: MongoDB Atlas with Mongoose
- **AI Engine**: Google GenAI SDK (`@google/genai`)
- **Security**: JSON Web Tokens, bcrypt, cookie-parser, CORS

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas database URI
- Google Gemini API key

### 1. Environment Setup

Create a `.env` file in the project root:

```env
PORT=8080
mongoatlas_url=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
```

### 2. Installation

Install root and frontend dependencies:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Running Locally

Start the backend:
```bash
npm run dev
```

In a separate terminal, start the frontend:
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Core API Routes

### Authentication (`/api/auth`)
- `POST /register` - Create a new user account
- `POST /login` - Authenticate user and issue cookie
- `POST /logout` - Clear user session
- `GET /me` - Get current authenticated user profile

### Conversations (`/api`)
- `GET /thread` - Retrieve all user threads
- `POST /thread` - Create a new thread
- `GET /thread/:id` - Fetch thread history
- `PATCH /thread/:id/title` - Rename a thread
- `DELETE /thread/:id` - Delete a thread
- `POST /chat` - Send a prompt and receive AI response

---

## Deployment

To build and run the full application as a single production service:

```bash
npm run build
npm start
```

For platform-specific guides (Render, Railway, Vercel), check `DEPLOYMENT.md`.

---

## License

MIT
