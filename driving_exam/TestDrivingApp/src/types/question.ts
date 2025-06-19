export interface Answer {
  guid: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  guid: string;
  number: number;
  text: string;
  points: number;
  imageUrl: string;
  moduleGuid: string;
  topicGuid: string;
  answers: Answer[];
} 