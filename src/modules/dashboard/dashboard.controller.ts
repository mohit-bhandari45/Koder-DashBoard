import { Request, Response } from "express";
import { AppError } from "../../utils/apperror.utils";
import { makeResponse } from "../../utils/makeResponse.utils";
import { getLanguageWiseSolvedProblems, getProgressSummary, getSkillWiseProgress } from "./dashboard.service";
import SubmissionModel from "../models/submission.model";
import mongoose from "mongoose";
import { getCache, setCache } from "../../lib/cache.lib";

/**
 * @desc Get overall progress summary for the authenticated user
 * @method GET
 * @route /dashboard/progress-summary
 * @access Private
 */
export async function getProgressSummaryHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const summary = await getProgressSummary(userId);

    res.status(200).json(makeResponse("Got the progress", summary));
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(makeResponse(error.message));
      return;
    }

    console.error("Unexpected Error:", error);
    res.status(500).json(makeResponse("Internal Server Error"));
  }
}

/**
 * @desc Get solved problem counts grouped by language for the authenticated user
 * @method GET
 * @route /dashboard/language-stats
 * @access Private
 */
export async function getLanguageStatsHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const data = await getLanguageWiseSolvedProblems(userId);

    res.status(200).json(makeResponse("Got the progress", data));
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(makeResponse(error.message));
      return;
    }

    console.error("Unexpected Error:", error);
    res.status(500).json(makeResponse("Internal Server Error"));
  }
}

/**
 * @desc Get skill-wise problem solving progress for the authenticated user
 * @method GET
 * @route /dashboard/skill-stats
 * @access Private
 */
export async function getSkillStatsHandler(req: Request, res: Response) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await getSkillWiseProgress(userId);
    res.status(200).json(makeResponse("Got the skills progress", data));
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(makeResponse(error.message));
      return;
    }

    console.error("Unexpected Error:", error);
    res.status(500).json(makeResponse("Internal Server Error"));
  }
}

/**
 * @desc Get 15 most recent accepted submissions for the authenticated user
 * @method GET
 * @route /dashboard/recent-submissions
 * @access Private
 */
export const getRecentSubmissions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw new AppError("Unauthorized", 401);

    const cacheKey = `dashboard:recentSubmissions:${userId}`;
    console.time("RecentSubmissions");

    // 1️⃣ Try cache first
    const cached = await getCache<any[]>(cacheKey);
    console.log(cached);
    if (cached) {
      console.timeEnd("RecentSubmissions");
      return res.status(200).json(makeResponse("Got all submissions (cached)", cached));
    }

    // 2️⃣ Fetch from DB
    const recentAccepted = await SubmissionModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: "Accepted" } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$problemId",
          latestSubmission: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$latestSubmission" } },
      { $limit: 15 }
    ]);

    const populated = await SubmissionModel.populate(recentAccepted, { path: "problemId" });

    // 3️⃣ Save in Redis with short TTL (e.g., 30s)
    await setCache(cacheKey, populated, 30);
    console.timeEnd("RecentSubmissions");

    res.status(200).json(makeResponse("Got all submissions", populated));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(makeResponse(error.message));
    }
    console.error("Unexpected Error:", error);
    res.status(500).json(makeResponse("Internal Server Error"));
  }
};
