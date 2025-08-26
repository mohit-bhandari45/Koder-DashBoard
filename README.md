# Koder Dashboard

Koder-DashBoard is a backend application designed to provide a personalized dashboard experience for Koder users. It offers insights into their coding progress, including overall summary, language-wise statistics, skill-based analysis, and recent submissions. The dashboard leverages Redis caching to optimize performance and ensure quick data retrieval.

---
**Repository URL:** [https://github.com/mohit-bhandari45/Koder-DashBoard](https://github.com/mohit-bhandari45/Koder-DashBoard)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Data Analytics](#data-analytics)
- [Contributing](#contributing)
- [License](#license)

---

## Features

*   **Progress Summary:** Displays an overview of the user's coding progress, including total problems, solved problems, submission count, acceptance rate, and difficulty-wise breakdown (Easy, Medium, Hard).
*   **Language Statistics:** Shows the number of problems solved by the user, grouped by programming language.
*   **Skill Statistics:**  Presents a skill-wise breakdown of the user's progress, categorized into Advanced, Intermediate, and Fundamental skills based on problem tags and a predefined skill tier mapping.
*   **Recent Submissions:** Fetches and displays the 15 most recent accepted submissions of the user, improving performance by utilizing Redis caching.
*   **Authentication:** Uses JWT (JSON Web Tokens) to protect routes and ensure authorized access to user-specific data using the `authCheck` middleware located in `src/modules/middlewares/auth.middleware.ts`.
*   **Redis Caching:** Implements Redis caching for frequently accessed data (progress summary, language stats, skill stats, and recent submissions) to minimize database queries and improve response times.

---

## Tech Stack

*   **Node.js:**  JavaScript runtime environment.
*   **Express.js:**  Web application framework.
*   **MongoDB:**  NoSQL database for storing user data, problems, and submissions.
*   **Mongoose:**  MongoDB object modeling tool.
*   **Redis:** In-memory data store for caching frequently accessed data.
*   **dotenv:**  For managing environment variables.
*   **cors:**  For enabling Cross-Origin Resource Sharing.
*   **cookie-parser:**  For parsing cookies.
*   **jsonwebtoken:** For generating and verifying JWT tokens.
*   **TypeScript:**  For static typing and improved code maintainability.
*   
---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud)

### Installation

```sh
git clone https://github.com/your-org/koder-dashboard.git
cd koder-dashboard
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/koder-dashboard
JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET

# Node Environment
NODE_ENV=development
```

### Running Locally

```sh
npm run dev
```

The dashboard service will start on [http://localhost:5000](http://localhost:5000).

---

## Project Structure

```
.
├── .git/
├── node_modules/
├── src/
├── config/
│   └── database.config.ts
├── modules/
│   └── dashboard/
│       ├── dashboard.controller.ts
│       ├── dashboard.docs.md
│       ├── dashboard.routes.ts
│       ├── dashboard.service.ts
│       └── dashboard.utils.ts
├── middlewares/
│   └── auth.middleware.ts
├── models/
│   ├── problem.model.ts
│   └── submission.model.ts
├── types/
│   ├── express/
│   │   ├── index.d.ts
│   ├── problem.types.ts
│   ├── submission.types.ts
│   └── user.types.ts
├── utils/
│   ├── apperror.utils.ts
│   ├── jwt.util.ts
│   └── makeResponse.utils.ts
├── index.ts
├── .env
├── .gitignore
├── nodemon.json
├── package-lock.json
├── package.json
├── tsconfig.json
└── README.md
```


---

## API Overview

All dashboard endpoints require authentication via JWT token.

### Dashboard Analytics

- `GET /dashboard/progress-summary` — Get overall progress summary for user
- `GET /dashboard/language-stats` — Get solved problems grouped by programming language
- `GET /dashboard/skill-stats` — Get skill-wise problem solving progress
- `GET /dashboard/recent-submissions` — Get 15 most recent accepted submissions

### Health Check

- `GET /` — Service health status

---

## Authentication

All dashboard endpoints are protected and require authentication:

- **Header**: `Authorization: Bearer <jwt_token>`
- **Cookie**: `accessToken=<jwt_token>`

The service validates JWT tokens issued by the main Koder backend service.

---

## Data Analytics

### Progress Summary
Returns comprehensive user statistics including:
- Total problems solved
- Problems by difficulty (Easy, Medium, Hard)
- Overall success rate
- Acceptance percentage

### Language Statistics
Provides insights on:
- Problems solved per programming language
- Most frequently used languages

### Skill-based Progress
Tracks progress across:
- Problem categories (Arrays, Strings, Dynamic Programming, etc.)
- Difficulty distribution per skill

### Recent Submissions
Displays:
- Latest 15 accepted submissions
- Problem details and metadata
- Submission timestamps
- Language used for each solution

---

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/analytics-improvement`)
3. Commit your changes (`git commit -am 'Add new analytics feature'`)
4. Push to the branch (`git push origin feature/analytics-improvement`)
5. Open a pull request

---

## License

[MIT](LICENSE)

---

## Integration

This dashboard service is designed to work alongside the main Koder backend. Ensure proper JWT token sharing and database synchronization between services for optimal functionality.

### Related Services
- **Koder Backend**: Main application server handling authentication, problems, and submissions
- Koder Backend : [https://github.com/mohit-bhandari45/Koder-Backend](https://github.com/mohit-bhandari45/Koder-Backend)
- **Koder Frontend**: React/Next.js application consuming dashboard analytics
- Koder Frontend : [https://github.com/mohit-bhandari45/Koder-Frontend](https://github.com/mohit-bhandari45/Koder-Frontend)

---

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/)
