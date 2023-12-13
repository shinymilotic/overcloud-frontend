import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ChoiceAnswerForm } from "./ChoiceAnswerForm";
import { QuestionForm } from "./QuestionForm";

export interface ChoiceQuestionForm extends QuestionForm {
  answers: FormArray<FormGroup<ChoiceAnswerForm>>;
}
