import { FormControl } from "@angular/forms";
import { PracticeQuestionForm } from "./PracticeQuestionForm";
import { Answer } from "src/app/core/models/test/answer.model";
import { PracticeChoiceAnswer } from "./PracticeChoiceAnswer";

export interface PracticeChoiceQuestionForm extends PracticeQuestionForm {
  answers: PracticeChoiceAnswer[];
  answerId: FormControl<string>;
}
