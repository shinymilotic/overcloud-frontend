import { Question } from "./question.model";

export interface Test {
  title: string;
  description: string;
  questions: Question[];
}
