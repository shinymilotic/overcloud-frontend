import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { QuestionForm } from "./form-model/QuestionForm";

export interface CreateTestForm {
  title: FormControl<string | null>;
  questions: FormArray<FormGroup<QuestionForm>>;
}
