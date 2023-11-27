import { Answer } from "./answer.model";

export interface Question {
  question: string;
  answers: Answer[];
}
