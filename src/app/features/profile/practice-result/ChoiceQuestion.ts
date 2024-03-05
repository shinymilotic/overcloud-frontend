import { ChoiceAnswer } from "./ChoiceAnswer";
import { Question } from "./Question";

export interface ChoiceResult extends Question {
    answers: ChoiceAnswer[];
}