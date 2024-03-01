import { Answer } from "./Answer";

export interface ChoiceAnswer extends Answer {
    truth: Boolean;
    isRightChoice: Boolean;
}