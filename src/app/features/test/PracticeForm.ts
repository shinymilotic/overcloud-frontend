import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { QuestionForm } from "../create-test/Question";

export interface PracticeForm {
  slug: FormControl<string>;
  questions: FormArray<FormGroup<QuestionForm>>;
}
