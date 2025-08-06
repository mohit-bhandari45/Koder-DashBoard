import { AppError } from "../../utils/apperror.utils";
import { makeResponse } from "../../utils/makeResponse.utils";
import SubmissionModel from "../models/submission.model";
import { Request, Response } from "express";

export async function getDashboardOverview(req: Request, res: Response): Promise<void> {
    const userId = req.user?._id;

    try {
        const totalSubmissions = await SubmissionModel.countDocuments({ userId });

        res.json({msg: "hello"});
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json(makeResponse(error.message));
            return;
        }

        console.error("Unexpected Error:", error);
        res.status(500).json(makeResponse("Internal Server Error"));
    }
}