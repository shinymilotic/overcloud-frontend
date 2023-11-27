import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { QuestionForm } from "./Question";

export interface CreateTestForm {
  title: FormControl<string | null>;
  questions: FormArray<FormGroup<QuestionForm>>;
}
