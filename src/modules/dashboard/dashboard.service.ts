import mongoose from "mongoose";
import ProblemModel from "../models/problem.model";
import SubmissionModel from "../models/submission.model";
import { skillTiers } from "./dashboard.utils";

/**
 * @route /dashboard/progress-summary
 * @method GET
 */
export async function getProgressSummary(userId: string) {
    // 1. First Fetch all the user's accepted submissions(just problemIds)
    /*  --> More memory-intensive and slower for large datasets.
        
        const submissions = await SubmissionModel.find({ userId, status: "Accepted" }, "problemId");
        const solvedProblemIds = new Set(submissions.map(s => s.problemId));
        const totalSolved = solvedProblemIds.size;
    */
    const solvedProblemIds: mongoose.Types.ObjectId[] = await SubmissionModel.distinct(
        "problemId",
        { userId, status: "Accepted" }
    );
    const totalSolved = solvedProblemIds.length;


    // 2. Total submissions by user
    /*  --> Slower and more memory-intensive if there are many documents, because it retrieves all the documents, not just the count.
        
        const totalUserSubmissions = await SubmissionModel.find({ userId });
        const total = totalUserSubmissions.length;
    */
    const totalUserSubmissions = await SubmissionModel.countDocuments();

    // 3. Accepted User Submissions by user to calculate accuracy
    const acceptedUserSubmissions = await SubmissionModel.countDocuments({
        userId,
        status: "Accepted"
    });

    const acceptanceRate = totalUserSubmissions > 0 ? (acceptedUserSubmissions / totalUserSubmissions) * 100 : 0;

    // 4. Aggregate total problems and solved by difficulty
    const difficultyAggragation = await ProblemModel.aggregate([
        {
            $facet: {
                totalByDifficulty: [
                    { $group: { _id: "$difficulty", total: { $sum: 1 } } }
                ],
                solvedByDifficulty: [
                    { $match: { _id: { $in: solvedProblemIds } } },
                    { $group: { _id: "$difficulty", solved: { $sum: 1 } } },
                ],
                totalProblems: [
                    { $count: "total" }
                ]
            }
        }
    ]);

    const aggResult = difficultyAggragation[0];

    // 5. Map total problems by difficulty
    const totalByDifficultyMap: Record<string, number> = {};
    aggResult.totalByDifficulty.forEach((entry: any) => {
        totalByDifficultyMap[entry._id.toLowerCase()] = entry.total;
    });

    // 6. Map solved problems by difficulty
    const solvedMap: Record<string, number> = {};
    aggResult.solvedByDifficulty.forEach((entry: any) => {
        solvedMap[entry._id.toLowerCase()] = entry.solved;
    });

    // 7. Combine solved and total per difficulty
    const byDifficulty: Record<string, { solved: number; total: number }> = {};
    ["easy", "medium", "hard"].forEach((diff) => {
        byDifficulty[diff] = { solved: solvedMap[diff] || 0, total: totalByDifficultyMap[diff] || 0 }
    });

    // 8. Total problems overall
    const totalProblems = aggResult.totalProblems[0]?.total || 0;

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
                _id: "$_id.language",
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

    const tieredSkills: Record<"Advanced" | "Intermediate" | "Fundamental", { skill: string, count: number }[]> = {
        Advanced: [],
        Intermediate: [],
        Fundamental: []
    }

    Object.entries(tagCount).forEach(([skill, count]) => {
        const tier = skillTiers[skill] || "Fundamental";
        tieredSkills[tier].push({ skill, count });
    });

    (Object.keys(tieredSkills) as (keyof typeof tieredSkills)[]).forEach(tier => {
        tieredSkills[tier].sort((a, b) => b.count - a.count);
    });

    return tieredSkills;
}