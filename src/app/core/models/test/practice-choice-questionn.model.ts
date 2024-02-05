import { Answer } from "./answer.model";
import { PracticeQuestion } from "./practice-question.model";

export interface PracticeChoice extends PracticeQuestion {
    questionType: number;
    answer: Answer[];
}