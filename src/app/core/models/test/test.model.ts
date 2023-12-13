import { Question } from "./question.model";

export interface Test {
  title: string;
  questions: Question[];
}
