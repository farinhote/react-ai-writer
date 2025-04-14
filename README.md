# React AI Writer

A React application with TypeScript frontend and Node.js backend.

## Features

- React TypeScript frontend with responsive design
- Node.js Express backend
- JWT Authentication (login/register)
- Docker setup for both frontend and backend
- Protected routes

## Project Structure

```
/simple-ai-writer
├── client/                # React TypeScript frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── assets/        # Images and other assets
│   │   ├── context/       # React context
│   │   └── pages/         # React pages
│   ├── Dockerfile         # Client Docker configuration
│   ├── package.json       # Client dependencies
│   └── tsconfig.json      # TypeScript configuration
├── server/                # Node.js backend
│   ├── src/               # Source code
│   │   └── server.js      # Simple Express server implementation
│   ├── Dockerfile         # Server Docker configuration
│   └── package.json       # Server dependencies
├── docker-compose.yml     # Docker Compose configuration
├── package.json           # Root package.json
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js (for local development)

### Running the Application

1. Clone the repository
2. Run the application using Docker:

```bash
docker-compose up
```

This will start both the client and server containers:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Development

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

## Notes

- The authentication system currently uses an in-memory store. In a production environment, this should be replaced with a proper database.