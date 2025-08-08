import { Router } from "express";
import { getLanguageStatsHandler, getProgressSummaryHandler, getSkillStatsHandler, getRecentSubmissions } from "./dashboard.controller";
import { authCheck } from "../middlewares/auth.middleware";

const router = Router();

router.use(authCheck);
router.get("/progress-summary", getProgressSummaryHandler);
router.get("/language-stats", getLanguageStatsHandler);
router.get("/skill-stats", getSkillStatsHandler);
router.get("/recent-submissions", getRecentSubmissions);

export default router;