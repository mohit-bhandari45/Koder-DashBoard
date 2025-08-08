import mongoose from "mongoose";
import ProblemModel from "../models/problem.model";
import SubmissionModel from "../models/submission.model";

/**
 * @route /dashboard/progress-summary
 * @method GET
 */
export async function getProgressSummary(userId: string) {
    const totalProblems = await ProblemModel.countDocuments();  // total problems
    const solvedProblemIds = await SubmissionModel.distinct(
        "problemId",
        { userId, status: "Accepted" }
    );

    const totalSolved = solvedProblemIds.length;

    // user total submission
    const totalUserSubmissions = await SubmissionModel.countDocuments({ userId });

    const acceptedUserSubmissions = await SubmissionModel.countDocuments({
        userId, status: "Accepted",
    });

    const acceptanceRate = totalUserSubmissions > 0 ? (acceptedUserSubmissions / totalUserSubmissions) : 0;

    const solvedProblemsByDifficulty = await ProblemModel.aggregate([
        {
            $match: { _id: { $in: solvedProblemIds } }
        },
        {
            $group: {
                _id: "$difficulty",
                count: { $sum: 1 },
            }
        },
    ]);

    const byDifficulty: Record<string, number> = {};
    solvedProblemsByDifficulty.forEach((entry) => {
        byDifficulty[entry._id.toLowerCase()] = entry.count; // normalize keys to lowercase
    });

    return {
        totalProblems,
        totalSolved,
        acceptanceRate,
        byDifficulty
    }
}

export async function getLanguageWiseSolvedProblems(userId: string) {
    const aggregation = await SubmissionModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: "Accepted",
            }
        },
        {
            $group: {
                _id: {
                    language: "$language",
                    problemId: "$problemId"
                }
            },
        },
        {
            $group: {
                _id: "$id.language",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);

    const results = aggregation.map(entry => ({
        language: entry._id,
        count: entry.count
    }));

    return {
        languages: results
    };
}

export async function getSkillWiseProgress(userId: string) {
    const solvedProblemIds = await SubmissionModel.distinct(
        "problemId",
        { userId: new mongoose.Types.ObjectId(userId), status: "Accepted" }
    );

    const problemsWithTags = await ProblemModel.find({
        _id: { $in: solvedProblemIds }
    }).select("tags");

    const tagCount: Record<string, number> = {};

    problemsWithTags.forEach((problem) => {
        problem.tags.forEach((tag: string) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
        })
    });

    const skills = Object.entries(tagCount).map(([skill, count]) => ({
        skill, count
    }));

    skills.sort((a, b) => b.count - a.count);

    return { skills };
}