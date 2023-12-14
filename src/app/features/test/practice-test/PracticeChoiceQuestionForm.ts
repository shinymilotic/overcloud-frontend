import { FormControl } from "@angular/forms";
import { PracticeQuestionForm } from "./PracticeQuestionForm";

export interface PracticeChoiceQuestionForm extends PracticeQuestionForm {
  answerId: FormControl<string>;
}
