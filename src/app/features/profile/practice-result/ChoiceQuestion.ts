import { ChoiceAnswer } from "./ChoiceAnswer";
import { Question } from "./Question";

export interface ChoiceQuestion extends Question {
    answers: ChoiceAnswer[];
}