import mongoose from "mongoose";
import { getCache, setCache } from "../../lib/cache.lib";
import ProblemModel from "../models/problem.model";
import SubmissionModel from "../models/submission.model";
import {
  IDifficultyStats,
  IGetLanguageWiseSolvedProblems,
  IGetProgressSummary,
  ILanguageWiseSolvedProblemsResponse,
  ISkillWiseProgress,
} from "./dashboard.types";
import { skillTiers } from "./dashboard.utils";

/**
 * @route /dashboard/progress-summary
 * @method GET
 */
export async function getProgressSummary(userId: string): Promise<IGetProgressSummary> {
  const cacheKey = `dashboard:progress:${userId}`;

  const cached = await getCache<IGetProgressSummary>(cacheKey);
  if (cached) {
    return cached; // instantly return from Redis
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // 1. First fetch all the problems and then count length
  /*  --> more memory-intensive and slower
        const problems = await ProblemModel.find({});
        const totalProblems = problems.length;
     */
  const totalProblems = await ProblemModel.countDocuments();

  // 2. First Fetch all the user's accepted submissions(just problemIds)
  /*  --> More memory-intensive and slower for large datasets.
        
        const submissions = await SubmissionModel.find({ userId: userObjectId, status: "Accepted" }, {problemId: 1});
        const solvedProblemIds = new Set(submissions.map(s => s.problemId));
        const totalSolved = solvedProblemIds.size;
    */
  const solvedProblemIds: mongoose.Types.ObjectId[] = await SubmissionModel.distinct("problemId", {
    userId: userObjectId,
    status: "Accepted",
  });
  const totalSolved = solvedProblemIds.length;

  // 3. Total submissions by user
  /*  --> Slower and more memory-intensive if there are many documents, because it retrieves all the documents, not just the count.
        
        const totalUserSubmissions = await SubmissionModel.find({ userId: userObjectId });
        const total = totalUserSubmissions.length;
    */
  const totalUserSubmissions = await SubmissionModel.countDocuments({ userId: userObjectId });

  // 4. Accepted User Submissions by user to calculate acceptance
  const totalAccepted = await SubmissionModel.countDocuments({
    userId: userObjectId,
    status: "Accepted",
  });

  // 5. Acceptance Rate
  const acceptanceRate =
    totalUserSubmissions > 0
      ? parseFloat(((totalAccepted / totalUserSubmissions) * 100).toFixed(2))
      : 0;

  const solvedProblems = await ProblemModel.find(
    { _id: { $in: solvedProblemIds } },
    { difficulty: 1 }
  ).lean();

  const [easyTotal, mediumTotal, hardTotal] = await Promise.all([
    ProblemModel.countDocuments({ difficulty: "Easy" }),
    ProblemModel.countDocuments({ difficulty: "Medium" }),
    ProblemModel.countDocuments({ difficulty: "Hard" }),
  ]);

  const easySolved = solvedProblems.filter((p) => p.difficulty === "Easy").length;
  const mediumSolved = solvedProblems.filter((p) => p.difficulty === "Medium").length;
  const hardSolved = solvedProblems.filter((p) => p.difficulty === "Hard").length;

  const byDifficulty: Record<"easy" | "medium" | "hard", IDifficultyStats> = {
    easy: { solved: easySolved, total: easyTotal },
    medium: { solved: mediumSolved, total: mediumTotal },
    hard: { solved: hardSolved, total: hardTotal },
  };

  const result: IGetProgressSummary = {
    totalProblems,
    totalSolved,
    totalUserSubmissions,
    acceptanceRate,
    byDifficulty,
  };

  await setCache<IGetProgressSummary>(cacheKey, result);
  return result;
}

export async function getLanguageWiseSolvedProblems(
  userId: string
): Promise<ILanguageWiseSolvedProblemsResponse> {
  const cacheKey = `dashboard:langstats:${userId}`;

  // 1️⃣ Checking cache first
  const cached = await getCache<ILanguageWiseSolvedProblemsResponse>(cacheKey);
  if (cached) return cached;

  // 2️⃣ Computing from DB
  const aggregation = await SubmissionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: "Accepted",
      },
    },
    {
      $group: {
        _id: { language: "$language", problemId: "$problemId" },
      },
    },
    {
      $group: {
        _id: "$_id.language",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const results: IGetLanguageWiseSolvedProblems[] = aggregation.map((entry) => ({
    language: entry._id,
    count: entry.count,
  }));

  const response: ILanguageWiseSolvedProblemsResponse = { languages: results };

  // 3️⃣ Saving result in Redis for 60 seconds
  await setCache<ILanguageWiseSolvedProblemsResponse>(cacheKey, response, 60); // TTL = 60s

  return response;
}

export async function getSkillWiseProgress(userId: string): Promise<ISkillWiseProgress> {
  const cacheKey = `dashboard:skills:${userId}`;

  // 1️⃣ Trying cache first
  const cached = await getCache<ISkillWiseProgress>(cacheKey);
  if (cached) return cached;

  // 2️⃣ Computing from DB
  const solvedProblemIds = await SubmissionModel.distinct("problemId", {
    userId: new mongoose.Types.ObjectId(userId),
    status: "Accepted",
  });

  const problemsWithTags = await ProblemModel.find({
    _id: { $in: solvedProblemIds },
  }).select("tags");

  const tagCount: Record<string, number> = {};
  problemsWithTags.forEach((problem) => {
    problem.tags.forEach((tag: string) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  const tieredSkills: ISkillWiseProgress = {
    Advanced: [],
    Intermediate: [],
    Fundamental: [],
  };

  Object.entries(tagCount).forEach(([skill, count]) => {
    const tier = skillTiers[skill] || "Fundamental";
    tieredSkills[tier].push({ skill, count });
  });

  // Sorting each tier by count descending
  (Object.keys(tieredSkills) as (keyof ISkillWiseProgress)[]).forEach((tier) => {
    tieredSkills[tier].sort((a, b) => b.count - a.count);
  });

  // 3️⃣ Saving in Redis with TTL (60 seconds)
  await setCache<ISkillWiseProgress>(cacheKey, tieredSkills, 60);

  return tieredSkills;
}
