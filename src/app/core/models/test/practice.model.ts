import { ChoiceAnswer } from "./choiceanswer.model";
import { EssayAnswer } from "./essayanswer.model";

export interface Practice {
  slug: string;
  choiceAnswers: ChoiceAnswer[];
  essayAnswers: EssayAnswer[];
}
