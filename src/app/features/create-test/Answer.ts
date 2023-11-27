import { FormControl, FormGroup } from "@angular/forms";

export interface AnswerForm {
  answer: FormControl<string | null>;
  truth: FormControl<boolean | null>;
}
