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
        "totalSolved": 30,
        "acceptanceRate": 20,
        "byDifficulty": {
            "easy": 15,
            "medium": 10,
            "hard": 5
        }
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
    "data": {
        "languages": [
        {
            "language": "Java",
            "count": 15
        },
        {
            "language": "Python",
            "count": 10
        },
        {
            "language": "C++",
            "count": 5
        }
        ]
    }
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
  "data": {
    "Advanced": [
      { "skill": "Dynamic Programming", "count": 12 },
      { "skill": "Graph Theory", "count": 7 }
    ],
    "Intermediate": [
      { "skill": "Sorting", "count": 10 },
      { "skill": "Two Pointers", "count": 6 }
    ],
    "Fundamental": [
      { "skill": "Arrays", "count": 15 },
      { "skill": "Strings", "count": 8 }
    ]
  }
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
      "_id": "66bfa12345abc67890d12345",
      "userId": "66be987654abc12345d67890",
      "problemId": "66bd12345abc67890d987654",
      "code": "public class Solution { public static void main(String[] args) { ... } }",
      "language": "Java",
      "status": "Accepted",
      "createdAt": "2025-08-11T10:15:30.000Z",
      "updatedAt": "2025-08-11T10:15:30.000Z",
      "__v": 0
    },
    {
      "_id": "66bfa12345abc67890d54321",
      "userId": "66be987654abc12345d67890",
      "problemId": "66bd54321abc67890d987654",
      "code": "def solve(): print('Hello World')",
      "language": "Python",
      "status": "Accepted",
      "createdAt": "2025-08-10T14:05:12.000Z",
      "updatedAt": "2025-08-10T14:05:12.000Z",
      "__v": 0
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

