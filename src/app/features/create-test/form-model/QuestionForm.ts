import { FormControl } from "@angular/forms";
import { QuestionType } from "../enum/QuestionType";

export interface QuestionForm {
  question: FormControl<string>;
  questionType: FormControl<QuestionType>;
}
