# React AI Writer

A powerful AI-assisted text editor built with React, TypeScript, and Node.js.

## Features

- AI-powered text processing with multiple actions:
  - Simplify: Make text clearer and more concise
  - Rewrite: Rewrite with different words while preserving meaning
  - Enhance: Improve text with better vocabulary and clearer structure
  - Formalize: Make text more formal and professional
  - Custom: Add your own AI actions
- Markdown editor with real-time preview
- Jina AI web search integration for finding references
- File management system (create, save, delete)
- JWT Authentication (login/register)
- Docker deployment ready for production
- Responsive design for desktop and mobile use

## Project Structure

```
/react-ai-writer
├── client/                # React TypeScript frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── assets/        # Images and other assets
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # React pages
│   │   └── types/         # TypeScript type definitions
│   ├── .env               # Development environment variables
│   ├── .env.production    # Production environment variables
│   ├── Dockerfile         # Client Docker configuration
│   ├── nginx.conf         # Nginx configuration for production
│   ├── package.json       # Client dependencies
│   └── tsconfig.json      # TypeScript configuration
├── server/                # Node.js backend
│   ├── src/               # Source code
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # Data models
│   │   ├── services/      # Business logic services
│   │   └── server.js      # Express server implementation
│   ├── .env               # Server environment variables
│   ├── Dockerfile         # Server Docker configuration
│   └── package.json       # Server dependencies
├── docker-compose.yml     # Docker Compose configuration
├── deploy.sh              # Deployment script
├── package.json           # Root package.json
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js (for local development)
- API keys for DeepSeek and Jina AI

### Development Setup

1. Clone the repository
2. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the API keys in `server/.env`
3. Run the application using Docker:

```bash
docker-compose up
```

This will start both the client and server containers:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Local Development

For local development without Docker:

#### Client

```bash
cd client
npm install
npm start
```

#### Server

```bash
cd server
npm install
npm run dev
```

## Production Deployment

To deploy the application to your server:

1. Clone the repository on your server
2. Run the deployment script:

```bash
./deploy.sh
```

3. When prompted, enter your server's domain name or IP address
4. Start the application in production mode:

```bash
docker-compose up -d --build
```

Your application will be available at:
- Frontend: http://your-server-domain.com
- API: http://your-server-domain.com/api

## Environment Variables

### Client

- `REACT_APP_API_URL`: URL of the backend API

### Server

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT token generation
- `DEEPSEEK_API_KEY`: API key for DeepSeek AI service
- `DEEPSEEK_BASE_URL`: Base URL for DeepSeek API
- `JINA_API_KEY`: API key for Jina AI search service

## Notes

- The authentication system currently uses an in-memory store. In a production environment, this should be replaced with a proper database.
- For security, update the JWT secret in production and never commit API keys to your repository.