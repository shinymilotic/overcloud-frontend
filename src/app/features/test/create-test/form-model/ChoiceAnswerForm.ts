import { FormControl, FormGroup } from "@angular/forms";

export interface ChoiceAnswerForm {
  answer: FormControl<string>;
  truth: FormControl<boolean>;
}
