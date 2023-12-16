import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ChoiceQuestionForm } from "../create-test/form-model/ChoiceQuestionForm";
import { QuestionForm } from "../create-test/form-model/QuestionForm";
import { PracticeQuestionForm } from "./PracticeQuestionForm";
import { Question } from "src/app/core/models/test/question.model";

export interface PracticeForm extends Question {
  practiceForm: PracticeQuestionForm;
}
