import { Router } from "express";
import { getLanguageStatsHandler, getProgressSummaryHandler, getSkillStatsHandler, getRecentSubmissions } from "./dashboard.controller";

const router = Router();

router.get("/progress-summary", getProgressSummaryHandler);
router.get("/language-stats", getLanguageStatsHandler);
router.get("/skill-stats", getSkillStatsHandler);
router.get("/recent-submissions", getRecentSubmissions);

export default router;