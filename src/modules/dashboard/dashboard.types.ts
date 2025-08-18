export interface IDifficultyStats {
  solved: number;
  total: number;
}

export interface IGetProgressSummary{
    totalProblems: number;
    totalSolved: number;
    totalUserSubmissions: number;
    acceptanceRate: number;
    byDifficulty: Record<"easy" | "medium" | "hard", IDifficultyStats>;
}

export interface IGetLanguageWiseSolvedProblems{
    language: string;
    count: number
}

export interface ILanguageWiseSolvedProblemsResponse {
    languages: IGetLanguageWiseSolvedProblems[];
}

export interface ISkillProgressItem {
  skill: string;
  count: number;
}

export interface ISkillWiseProgress {
  Advanced: ISkillProgressItem[];
  Intermediate: ISkillProgressItem[];
  Fundamental: ISkillProgressItem[];
}