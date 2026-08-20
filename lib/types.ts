export type QuestionType = "number" | "single-select";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  category: string;
  prompt: string;
  type: QuestionType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export type Answers = Record<string, string | number>;

export interface QualifyingQuestion {
  id: string;
  label: string;
  options: QuestionOption[];
}

export type QualifyingAnswers = Record<string, string>;

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualifying: QualifyingAnswers;
}

export interface ScoreFactor {
  questionId: string;
  label: string;
  years: number;
  explanation: string;
}

export interface AssessmentResult {
  chronologicalAge: number;
  healthAge: number;
  deltaYears: number;
  tierId: string;
  tierLabel: string;
  tierDescription: string;
  topFactors: ScoreFactor[];
  // True if they reported any real strength training or cardio effort.
  // False only when they answered "never" to both. Used to pick copy that
  // doesn't falsely assume they've already been working out.
  hasTrainingEffort: boolean;
}
