<div align="center">
    <h1>KLAuth: Centralized Authentication Service</h1>
    <p>A robust, scalable, and production-ready Authentication & Authorization service built with the modern Node.js ecosystem.</p>
    <img src="https://img.shields.io/github/last-commit/klpod221/klauth?style=for-the-badge&color=74c7ec&labelColor=111827" alt="Last Commit">
    <img src="https://img.shields.io/github/stars/klpod221/klauth?style=for-the-badge&color=facc15&labelColor=111827" alt="GitHub Stars">
    <img src="https://img.shields.io/github/repo-size/klpod221/klauth?style=for-the-badge&color=a78bfa&labelColor=111827" alt="Repo Size">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&color=34d399&labelColor=111827" alt="License">
</div>

## 📝 Description

**KLAuth** is a centralized **Authentication and Authorization service** designed to be the single source of truth for user identity across multiple applications or microservices. It handles the complete user lifecycle, including registration, login, session management, email verification, and password resets, providing secure tokens for accessing protected resources in other services.

The core of the system is a secure **Public/Private Key (RS256 JWT)** strategy. This allows other "Resource Services" to verify user identity independently and statelessly, simply by using the public key provided by KLAuth, without needing access to a shared secret or the central database.

## ✨ Key Features

-   **Asymmetric JWT Authentication**: Secure stateless authentication using JSON Web Tokens signed with the RS256 algorithm.
-   **Full Token Lifecycle**: Implements a robust token strategy with short-lived Access Tokens and long-lived, revokable Refresh Tokens.
-   **Complete User Flow**:
    -   User Registration with **Email Verification**.
    -   Secure Login & Logout.
    -   **Forgot Password** and Reset Password functionality.
    -   Ability to **resend verification emails** for unverified accounts.
-   **High-Performance Architecture**:
    -   **Background Job Queues**: Offloads time-consuming tasks like sending emails to a Redis-backed queue (`BullMQ`), ensuring fast API responses.
    -   **Production-Ready Process Management**: Configured with `PM2` for clustering (utilizing all CPU cores), automatic restarts, and process monitoring.
-   **Robust Security & Validation**:
    -   **Secure Password Hashing**: Uses `bcrypt` to securely hash and store user passwords.
    -   **Input Validation**: Protects all endpoints with `express-validator` to ensure data integrity.
    -   **Rate Limiting**: Shields the API from brute-force attacks and abuse using a Redis-backed rate limiter.
    -   **Centralized Error Handling**: A consistent and clean system for handling application errors.
-   **Administrator APIs**: Protected endpoints for managing the system, including:
    -   CRUD operations for client **Services**.
    -   API to query system logs directly from the database.
-   **Advanced Logging**:
    -   Configured with `Winston` for structured, level-based logging.
    -   Logs are written to rotating files and persisted to MongoDB in production for easy querying.
-   **Dockerized Environment**: Uses Docker Compose for easy, one-command setup of dependencies like MongoDB and Redis.

## 🛠️ Tech Stack

<div align="center">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
    <img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white" alt="PM2">
</div>

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
-   [PM2](https://pm2.keymetrics.io/) installed globally: `npm install -g pm2`
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
    _Ensure the values in `.env` are correct, especially for the database, Redis, and mail server._

4.  **Generate Public/Private Keys:**
    These keys are NOT tracked by Git and must be generated locally.
    ```bash
    # Create the keys directory if it doesn't exist
    mkdir -p keys

    # Generate a private key
    openssl genrsa -out keys/private.pem 2048

    # Generate a public key from the private key
    openssl rsa -in keys/private.pem -pubout -out keys/public.pem
    ```

5.  **Start Background Services:**
    This command will start MongoDB and Redis containers in the background.
    ```bash
    docker-compose up -d
    ```

### Running the Application

-   **For Development:**
    You need to run the API server and the Queue Worker in separate terminals.
    ```bash
    # Terminal 1: Start the API Server with auto-reloading
    npm run dev

    # Terminal 2: Start the Queue Worker
    npm run worker
    ```

-   **For Production:**
    PM2 will manage both the API cluster and the Worker.
    ```bash
    # Start all applications defined in ecosystem.config.js
    npm run start:prod

    # Monitor logs and performance
    npm run logs
    npm run monit

    # Stop all applications
    npm run stop:prod
    ```

## 📡 Core API Endpoints

A summary of the main user-facing authentication endpoints.

| Method | Endpoint                    | Protection | Description                                           |
| :----- | :-------------------------- | :--------- | :---------------------------------------------------- |
| `POST` | `/api/auth/register`        | Public     | Register a new user and trigger verification email.   |
| `POST` | `/api/auth/login`           | Public     | Log in and receive Access/Refresh tokens.             |
| `POST` | `/api/auth/logout`          | Public     | Invalidate a Refresh Token.                           |
| `POST` | `/api/auth/refresh-token`   | Public     | Get a new Access Token using a Refresh Token.         |
| `GET`  | `/api/auth/profile`         | **Private**  | Get the profile of the currently logged-in user.      |
| `POST` | `/api/auth/verify-email`    | Public     | Verify a user's email using a token from the email.   |
| `POST` | `/api/auth/forgot-password` | Public     | Trigger a password reset email.                       |
| `POST` | `/api/auth/reset-password`  | Public     | Set a new password using a token from the email.      |
| `POST` | `/api/auth/resend-verification` | Public | Request a new verification email.                 |

---
_This README was crafted with assistance from an AI model._
