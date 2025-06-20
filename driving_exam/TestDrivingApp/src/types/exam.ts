export interface ExamAnswer {
  guid: string;
  text: string;
  isCorrect: boolean;
}

export interface ExamResponse {
  number: number;
  text: string;
  points: number;
  moduleGuid: string;
  topicGuid: string;
  imageUrl: string;
  answers: ExamAnswer[];
}

export interface ExamQuestion extends ExamResponse {
  guid: string;
  selectedAnswers: string[];
  isChecked: boolean;
  isCorrect: boolean;
  answerResults?: Record<string, boolean>;
} 