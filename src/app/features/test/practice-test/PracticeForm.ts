import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ChoiceQuestionForm } from "../create-test/form-model/ChoiceQuestionForm";
import { QuestionForm } from "../create-test/form-model/QuestionForm";

export interface PracticeForm {
  questions: FormArray<FormGroup<QuestionForm>>;
}
