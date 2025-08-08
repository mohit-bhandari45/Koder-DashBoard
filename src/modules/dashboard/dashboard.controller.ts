import { Request, Response } from "express";
import { AppError } from "../../utils/apperror.utils";
import { makeResponse } from "../../utils/makeResponse.utils";
import { getLanguageWiseSolvedProblems, getProgressSummary, getSkillWiseProgress } from "./dashboard.service";
import SubmissionModel from "../models/submission.model";

export async function getProgressSummaryHandler(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.user?._id as unknown as string;

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

export async function getLanguageStatsHandler(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.user?._id as unknown as string;

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

export async function getSkillStatsHandler(req: Request, res: Response) {
    try {
        const userId = req.user?._id as unknown as string;

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

export const getRecentSubmissions = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            throw new AppError("Unauthorized", 401);
        }

        const recentAccepted = await SubmissionModel.find({
            userId,
            status: "Accepted"
        }).sort({ createdAt: -1 }).limit(15);

        res.status(200).json(makeResponse("Got all submissions", recentAccepted));
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json(makeResponse(error.message));
            return;
        }

        console.error("Unexpected Error:", error);
        res.status(500).json(makeResponse("Internal Server Error"));
    }

}