import { FormControl } from "@angular/forms";
import { QuestionType } from "../create-test/enum/QuestionType";

export interface PracticeQuestionForm {
  question: FormControl<string>;
  questionType: FormControl<QuestionType>;
}
