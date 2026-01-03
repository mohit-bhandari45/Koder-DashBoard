import { Router } from "express";
import { authCheck } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authCheck);

// Admin routes
// router.post("/", createProblem);        // Add new problem
// router.get("/", getProblems);           // List all problems (maybe filter by difficulty/tags)
// router.get("/:id", getProblemById);     // View a specific problem
// router.put("/:id", updateProblem);      // Edit problem
// router.delete("/:id", deleteProblem);   // Delete problem

export default router;