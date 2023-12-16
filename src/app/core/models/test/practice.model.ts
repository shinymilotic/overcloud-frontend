import { EssayAnswer } from "./essayanswer.model";

export interface Practice {
  slug: string;
  choiceAnswers: string[];
  essayAnswers: EssayAnswer[];
}
