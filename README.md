# Koder Dashboard

A dedicated analytics and metrics service for the Koder platform, providing comprehensive user progress tracking, performance analytics, and submission insights for user.

---

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

- **Progress Analytics**: Comprehensive user progress tracking and problems solved
- **Language Statistics**: Problem-solving metrics grouped by programming language
- **Skill-based Insights**: Progress tracking categorized by problem difficulty and topics
- **Recent Activity**: Real-time tracking of latest accepted submissions
- **JWT Authentication**: Secure cookie based authentication for all endpoints
- **RESTful API**: Clean, standardized API design for easy integration
- **MongoDB Integration**: Efficient data storage and retrieval for analytics

---

## Tech Stack

- **Node.js** (TypeScript)
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT** for authentication
- **CORS** for cross-origin requests

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
