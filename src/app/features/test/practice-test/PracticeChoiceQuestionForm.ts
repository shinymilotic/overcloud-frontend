import { FormControl } from "@angular/forms";
import { PracticeQuestionForm } from "./PracticeQuestionForm";
import { Answer } from "src/app/core/models/test/answer.model";
import { PracticeChoiceAnswer } from "./PracticeChoiceAnswer";
import { Question } from "src/app/core/models/test/question.model";

export interface PracticeChoiceQuestionForm extends Question {
  answers: PracticeChoiceAnswer[];
  isMultipleAnswer: boolean;
}
