import { CommonModule, NgForOf, NgIf } from "@angular/common";
import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
} from "@angular/core";
import {
    AbstractControl,
    Form,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { Errors } from "src/app/core/models/errors.model";
import { Question } from "src/app/core/models/test/question.model";
import { Test } from "src/app/core/models/test/test.model";
import { TestService } from "src/app/core/services/test.service";
import { ListErrorsComponent } from "src/app/shared/list-errors.component";
import { SideBarComponent } from "../../side-bar/side-bar.component";
import { CreateTestForm } from "./CreateTestForm";
import { QuestionType } from "./enum/QuestionType";
import { ChoiceAnswerForm } from "./form-model/ChoiceAnswerForm";
import { ChoiceQuestionForm } from "./form-model/ChoiceQuestionForm";
import { EssayQuestionForm } from "./form-model/EssayQuestionForm";
import { QuestionForm } from "./form-model/QuestionForm";

@Component({
    selector: "app-create-test",
    templateUrl: "./create-test.component.html",
    styleUrls: ["./create-test.component.css"],
    standalone: true,
    imports: [
        ListErrorsComponent,
        FormsModule,
        ReactiveFormsModule,
        NgForOf,
        CommonModule,
        NgIf,
        SideBarComponent
    ]
})
export class CreateTestComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  errors!: Errors[];
  testForm: FormGroup = this.fb.group({
    title: this.fb.control(""),
    description: this.fb.control(""),
    questions: this.fb.array([]),
  });
  destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly testService: TestService,
    private readonly router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get questionsFormArr(): FormArray<FormGroup<QuestionForm>> {
    return this.testForm.get("questions") as FormArray<FormGroup<QuestionForm>>;
  }

  get choiceQuestionsFormArr(): FormArray<FormGroup<ChoiceQuestionForm>> {
    return this.testForm.get("questions") as FormArray<
      FormGroup<ChoiceQuestionForm>
    >;
  }

  get essayQuestionsFormArr(): FormArray<FormGroup<EssayQuestionForm>> {
    return this.testForm.get("questions") as FormArray<
      FormGroup<EssayQuestionForm>
    >;
  }

  getAnswerFormArr(qIndex: number): FormArray<FormGroup<ChoiceAnswerForm>> {
    const questions = this.testForm.get("questions") as FormArray<
      FormGroup<ChoiceQuestionForm>
    >;
    return questions.at(qIndex).get("answers") as FormArray<
      FormGroup<ChoiceAnswerForm>
    >;
  }

  ngOnInit(): void {}

  addQuestion() {
    this.choiceQuestionsFormArr.push(
      this.fb.group<ChoiceQuestionForm>({
        question: this.fb.nonNullable.control("", Validators.required),
        questionType: this.fb.nonNullable.control(
          QuestionType.CHOICE,
          Validators.required
        ),
        answers: this.fb.array([
          this.fb.group<ChoiceAnswerForm>({
            answer: this.fb.nonNullable.control("", Validators.required),
            truth: this.fb.nonNullable.control(false, Validators.required),
          }),
          this.fb.group<ChoiceAnswerForm>({
            answer: this.fb.nonNullable.control("", Validators.required),
            truth: this.fb.nonNullable.control(false, Validators.required),
          }),
          this.fb.group<ChoiceAnswerForm>({
            answer: this.fb.nonNullable.control("", Validators.required),
            truth: this.fb.nonNullable.control(false, Validators.required),
          }),
          this.fb.group<ChoiceAnswerForm>({
            answer: this.fb.nonNullable.control("", Validators.required),
            truth: this.fb.nonNullable.control(false, Validators.required),
          }),
        ]),
      })
    );
  }

  addEssayQuestion() {
    this.essayQuestionsFormArr.push(
      this.fb.group<EssayQuestionForm>({
        question: this.fb.nonNullable.control("", Validators.required),
        questionType: this.fb.nonNullable.control(
          QuestionType.ESSAY,
          Validators.required,
        ),
      })
    );
  }

  deleteQuestion(qIndex: number) {
    this.questionsFormArr.removeAt(qIndex);
  }

  submitForm() {
    const questions: Question[] = this.testForm.value.questions as Question[];
    const title: string = this.testForm.value.title as string;
    const description: string = this.testForm.value.description as string;
    // create post request
    const test: Test = {
      title: title,
      description: description,
      questions: questions,
    };
    console.log(test);
    this.testService
      .create(test)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          void this.router.navigate(["/tests"]);
        },
        error: ({ errors }) => {
          this.errors = errors;
          this.isSubmitting = false;
        },
      });
  }

  addAnswer(qIndex: number, event?: KeyboardEvent) {
    // If the tabbed element is the last answer element
    if (event == null) {
      this.getAnswerFormArr(qIndex).push(
        this.fb.group<ChoiceAnswerForm>({
          answer: this.fb.nonNullable.control("", Validators.required),
          truth: this.fb.nonNullable.control(false, Validators.required),
        })
      );
    }
  }

  focusLastAnswer() {}

  deleteAnswer(qIndex: number, aIndex: number) {
    this.getAnswerFormArr(qIndex).removeAt(aIndex);
  }

  isChoiceQuestion(qIndex: number): boolean {
    const question = this.questionsFormArr.at(
      qIndex
    ) as FormGroup<QuestionForm>;
    if (question.value.questionType == QuestionType.CHOICE) {
      return true;
    }

    return false;
  }
}
