
export enum TaskPart {
  PART1 = 'PART1',
  PART2 = 'PART2',
  PART3 = 'PART3'
}

export interface Part1Question {
  id: string;
  imageUrl: string;
  keywords: string[];
}

export interface Part2Question {
  id: string;
  emailContext: string;
  requirements: string[];
  type: 'personal' | 'business';
}

export interface Part3Question {
  id: string;
  topic: string;
}

export interface AIResult {
  score: number;
  grammarFeedback: string;
  vocabularyFeedback: string;
  generalFeedback: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  type: 'Module' | 'Full Test';
  part: TaskPart | 'ALL';
  results: (AIResult | null)[];
}
