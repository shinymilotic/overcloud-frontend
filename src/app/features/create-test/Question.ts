import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { AnswerForm } from "./Answer";

export interface QuestionForm {
  question: FormControl<string | null>;
  answers: FormArray<FormGroup<AnswerForm>>;
}
