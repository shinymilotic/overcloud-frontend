import { Answer } from "./answer.model";
import { Question } from "./question.model";

export interface ChoiceQuestion extends Question {
  answers: Answer[];
}
