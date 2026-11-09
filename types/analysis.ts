export type PriorityLevel = "High" | "Medium" | "Low";

export interface ActionStep {
  step: number;
  task: string;
  priority: PriorityLevel;
}

export interface AnalysisResult {
  summary: string;
  keyTakeaways: string[];
  actionSteps: ActionStep[];
  tags: string[];
}

export interface AnalyzeRequest {
  content: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  executionTimeMs?: number;
  isDemoMode?: boolean;
}
