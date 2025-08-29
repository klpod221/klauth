<div align="center">
    <h1>KLAuth: Centralized Authentication Service</h1>
    <p>A robust, scalable, and secure authentication/authorization service built with Node.js, Express, MongoDB, and Redis.</p>
    <img src="https://img.shields.io/github/last-commit/klpod221/klauth?style=for-the-badge&color=ffb4a2&labelColor=201a19" alt="Last Commit">
    <img src="https://img.shields.io/github/stars/klpod221/klauth?style=for-the-badge&color=e6c419&labelColor=1d1b16" alt="GitHub Stars">
    <img src="https://img.shields.io/github/repo-size/klpod221/klauth?style=for-the-badge&color=a8c7ff&labelColor=1a1b1f" alt="Repo Size">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&color=b9fbc0&labelColor=1a1f1a" alt="License">
</div>

## 📝 Description

This project is a centralized **Authentication and Authorization service** designed to be the single source of truth for user identity across multiple applications or microservices. It handles user registration, login, session management, and provides secure tokens for accessing protected resources.

The core of the system is a secure **Public/Private Key (RS256 JWT)** strategy, which allows other services to verify user identity independently without needing access to a shared secret.

## ✨ Key Features

-   **JWT Authentication**: Secure stateless authentication using JSON Web Tokens signed with RS256 algorithm.
-   **Access & Refresh Tokens**: Implements a robust token strategy with short-lived access tokens and long-lived refresh tokens.
-   **Refresh Token Rotation**: Enhances security by invalidating and re-issuing refresh tokens on each use.
-   **Secure Password Hashing**: Uses `bcrypt` to securely hash and store user passwords.
-   **Protected Routes**: Middleware to easily protect any API endpoint.
-   **Centralized Error Handling**: A consistent and clean way to handle application errors.
-   **Dockerized Environment**: Uses Docker Compose for easy setup of dependencies like MongoDB.
-   **Rate Limiting**: Protects APIs from abuse using Redis.
-   *(Planned)* **Background Job Queues**: Offloads tasks like sending emails to a Redis queue for better performance.
-   *(Planned)* **Dynamic Configuration**: Admin dashboard to manage CORS, rate limits, and other settings per service.

## 🛠️ Tech Stack

<div align="center">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</div>

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
-   [OpenSSL](https://www.openssl.org/) (usually pre-installed on Linux/macOS)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/klpod221/klauth.git
    cd klauth
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Create your environment file:**
    Copy the example file and fill in your details.
    ```bash
    cp .env.example .env
    ```
    *Ensure the values in `.env` are correct, especially for the database connection.*

4.  **Generate Public/Private Keys:**
    Run these commands in your terminal to generate the necessary keys for JWT signing.
    ```bash
    # Create the keys directory if it doesn't exist
    mkdir -p keys

    # Generate a private key
    openssl genrsa -out keys/private.pem 2048

    # Generate a public key from the private key
    openssl rsa -in keys/private.pem -pubout -out keys/public.pem
    ```

5.  **Start the database with Docker:**
    This command will start a MongoDB container in the background.
    ```bash
    docker-compose up -d
    ```

6.  **Run the application:**
    ```bash
    # For development with auto-reloading
    npm run dev

    # For production
    npm start
    ```
    The server should now be running on `http://localhost:3000`.

## 📡 API Endpoints

Here is a list of the available API endpoints.

| Method | Endpoint              | Protection | Description                                       |
| :----- | :-------------------- | :--------- | :------------------------------------------------ |
| `POST` | `/api/auth/register`  | Public     | Register a new user.                              |
| `POST` | `/api/auth/login`     | Public     | Log in a user and receive auth tokens.            |
| `POST` | `/api/auth/logout`    | Public     | Log out a user by invalidating the refresh token. |
| `POST` | `/api/auth/refresh-token` | Public | Get a new access token using a refresh token.     |
| `GET`  | `/api/auth/profile`   | **Private**  | Get the profile of the currently logged-in user.  |

## ✅ Project Checklist

This checklist tracks the progress of the project features.

### Completed
- [x] Project Setup with Express.js
- [x] Dockerized MongoDB Environment
- [x] Core User Model and Password Hashing
- [x] JWT (RS256) Implementation with Public/Private Keys
- [x] Registration Endpoint
- [x] Login Endpoint with Access/Refresh Token Generation
- [x] Refresh Token Endpoint with Token Rotation
- [x] Logout Endpoint (Token Invalidation)
- [x] Protected Route Middleware (`auth`)
- [x] Centralized & Consistent Error Handling
- [x] Redis Integration: Rate Limiting Middleware
- [x] Implement Validation Layer for Incoming Requests (`express-validator`)

### To-Do
- [ ] Redis Integration: Queue System for Background Jobs (e.g., Mailer)
- [ ] Dynamic CORS Configuration from Database
- [ ] Admin Dashboard: Basic UI (Server-Side Rendered with EJS)
- [ ] Admin Dashboard: APIs for managing services, CORS, and rate limits
- [ ] Advanced Logging (to files and/or external services)
- [ ] Setup Monitoring (e.g., with PM2 or other tools)
- [ ] Write Unit and Integration Tests

---
_This README was generated with assistance from an AI model._
