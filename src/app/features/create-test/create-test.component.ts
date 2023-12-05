import { Component, OnInit } from "@angular/core";
import { Errors } from "src/app/core/models/errors.model";
import { ListErrorsComponent } from "src/app/shared/list-errors.component";
import { CreateTestForm } from "./CreateTestForm";
import { AnswerForm } from "./Answer";
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
import { NgForOf, NgIf } from "@angular/common";
import { QuestionForm } from "./Question";
import { CommonModule } from "@angular/common";
import { Question } from "src/app/core/models/question.model";
import { TestService } from "src/app/core/services/test.service";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { Test } from "src/app/core/models/test.model";

@Component({
  selector: "app-create-test",
  templateUrl: "./create-test.component.html",
  styleUrls: ["./create-test.component.css"],
  imports: [
    ListErrorsComponent,
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    CommonModule,
    NgIf,
  ],
  standalone: true,
})
export class CreateTestComponent implements OnInit {
  isSubmitting = false;
  errors!: Errors[];
  testForm: FormGroup<CreateTestForm> = this.fb.group<CreateTestForm>({
    title: this.fb.control(""),
    questions: this.fb.array([
      this.fb.group<QuestionForm>({
        question: this.fb.control("", Validators.required),
        answers: this.fb.array([
          this.fb.group<AnswerForm>({
            answer: this.fb.control("", Validators.required),
            truth: this.fb.control(false, Validators.required),
          }),
        ]),
      }),
    ]),
  });
  destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly testService: TestService,
    private readonly router: Router
  ) {}

  get questionsFormArr(): FormArray<FormGroup<QuestionForm>> {
    return this.testForm.get("questions") as FormArray<FormGroup<QuestionForm>>;
  }

  getAnswerFormArr(
    question: FormGroup<QuestionForm>
  ): FormArray<FormGroup<AnswerForm>> {
    return question.get("answers") as FormArray<FormGroup<AnswerForm>>;
  }

  ngOnInit(): void {}

  addQuestion() {
    this.questionsFormArr.push(
      this.fb.group<QuestionForm>({
        question: this.fb.control("", Validators.required),
        answers: this.fb.array([
          this.fb.group<AnswerForm>({
            answer: this.fb.control("", Validators.required),
            truth: this.fb.control(false, Validators.required),
          }),
        ]),
      })
    );
  }

  deleteQuestion(qIndex: number) {
    this.questionsFormArr.removeAt(qIndex);
  }

  submitForm() {
    const questions: Question[] = this.testForm.value.questions as Question[];
    const title: string = this.testForm.value.title as string;
    // create post request
    const test: Test = {
      title: title,
      questions: questions,
    };

    this.testService
      .create(test)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(["/tests"]);
        },
        error: ({ errors }) => {
          this.errors = errors;
          this.isSubmitting = false;
        },
      });
  }

  addAnswer(question: FormGroup<QuestionForm>) {
    this.getAnswerFormArr(question).push(
      this.fb.group<AnswerForm>({
        answer: this.fb.control("", Validators.required),
        truth: this.fb.control(false, Validators.required),
      })
    );
  }

  deleteAnswer(question: FormGroup<QuestionForm>, aIndex: number) {
    this.getAnswerFormArr(question).removeAt(aIndex);
  }
}
