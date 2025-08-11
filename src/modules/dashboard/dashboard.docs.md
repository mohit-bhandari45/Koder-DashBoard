# 📄 Dashboard API Documentation

## API Endpoints (Dashboard Controller)

These routes require **authentication**.

---

### a) Get Progress Summary
**Description:** Fetch the overall progress summary of the logged-in user.  
**Method:** `GET`  
**Route:** `/dashboard/progress-summary`  
**Access:** Private (JWT Auth)  

**Request Headers:**

Authorization: Bearer <token>


**Sample Response:**
{
"message": "Got the progress",
"data": {
"totalProblems": 50,
"solved": 30,
"unsolved": 20
}
}


---

### b) Get Language Stats
**Description:** Fetch count of problems solved grouped by programming language.  
**Method:** `GET`  
**Route:** `/dashboard/language-stats`  
**Access:** Private  

**Sample Response:**

{
"message": "Got the progress",
"data": [
{ "language": "javascript", "solvedCount": 15 },
{ "language": "python", "solvedCount": 10 }
]
}


---

### c) Get Skill Stats
**Description:** Fetch skill-wise problem-solving progress for user.  
**Method:** `GET`  
**Route:** `/dashboard/skill-stats`  
**Access:** Private  

**Sample Response:**
{
"message": "Got the skills progress",
"data": [
{ "skill": "Dynamic Programming", "solved": 8, "total": 20 },
{ "skill": "Arrays", "solved": 10, "total": 15 }
]
}

---

### d) Get Recent Submissions
**Description:** Fetch 15 most recent accepted submissions of the authenticated user.  
**Method:** `GET`  
**Route:** `/dashboard/recent-submissions`  
**Access:** Private  

**Sample Response:**
{
"message": "Got all submissions",
"data": [
{
"_id": "64f1e43a27684",
"problemId": "64e9c78f963aa",
"language": "javascript",
"code": "function example() { return 42; }",
"status": "Accepted",
"createdAt": "2025-08-08T18:23:00Z"
}
]
}

---

## 3. Error Responses
| Code | Message                  |
|------|--------------------------|
| 401  | Unauthorized             |
| 500  | Internal Server Error    |
| 400  | Validation errors        |

---

