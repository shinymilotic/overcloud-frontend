import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ChoiceQuestionForm } from "../create-test/form-model/ChoiceQuestionForm";

export interface PracticeForm {
  slug: FormControl<string>;
  questions: FormArray<FormGroup<ChoiceQuestionForm>>;
}
