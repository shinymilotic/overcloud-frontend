import { FormControl } from "@angular/forms";
import { PracticeQuestionForm } from "./PracticeQuestionForm";

export interface PracticeEssayQuestionForm extends PracticeQuestionForm {
  answer: FormControl<string>;
}
