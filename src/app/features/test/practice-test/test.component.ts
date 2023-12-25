import { NgForOf, CommonModule, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import {
  combineLatest,
  catchError,
  throwError,
  takeUntil,
  Subject,
} from "rxjs";
import { TestResponse } from "src/app/core/models/test/test-response.model";
import { User } from "src/app/core/models/auth/user.model";
import { TestService } from "src/app/core/services/test.service";
import { UserService } from "src/app/core/services/user.service";
import { Errors } from "src/app/core/models/errors.model";
import { PracticeService } from "src/app/core/services/practice.service";
import { Practice } from "src/app/core/models/test/practice.model";
import { ChoiceQuestion } from "src/app/core/models/test/choicequestion.model";
import { QuestionType } from "../create-test/enum/QuestionType";
import { Question } from "src/app/core/models/test/question.model";
import { EssayQuestion } from "src/app/core/models/test/essayquestion.model";
import { PracticeForm } from "./PracticeForm";
import { PracticeQuestionForm } from "./PracticeQuestionForm";
import { PracticeChoiceAnswer } from "./PracticeChoiceAnswer";
import { PracticeChoiceQuestionForm } from "./PracticeChoiceQuestionForm";
import { PracticeEssayQuestionForm } from "./PracticeEssayQuestionForm";
import { ChoiceAnswerForm } from "../create-test/form-model/ChoiceAnswerForm";
import { ChoiceQuestionForm } from "../create-test/form-model/ChoiceQuestionForm";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.css"],
  imports: [
    RouterLinkActive,
    RouterLink,
    NgForOf,
    CommonModule,
    NgIf,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class TestComponent implements OnInit {
  errors!: Errors[];
  isSubmitting = false;
  currentUser!: User | null;
  title: string = "";
  slug: string = "";
  questions: Question[] = [];
  destroy$ = new Subject<void>();
  questionForm: FormGroup = new FormGroup([]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly userService: UserService,
    private readonly router: Router,
    public readonly fb: FormBuilder,
    private readonly practiceService: PracticeService
  ) {}

  toFormGroup(questions: Question[]) {
    const group: any = {};

    questions.forEach((question) => {
      group[question.id] = this.fb.control("");
    });

    return new FormGroup(group);
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.params["slug"];
    combineLatest([this.testService.getOne(slug), this.userService.currentUser])
      .pipe(
        catchError((err) => {
          void this.router.navigate(["/"]);
          return throwError(() => err);
        })
      )
      .subscribe(([test, currentUser]) => {
        test.questions.forEach((question) => {
          this.slug = test.slug;
          this.title = test.title;
          this.currentUser = currentUser;
          if (question.questionType == QuestionType.CHOICE) {
            const choiceQuestion = question as ChoiceQuestion;
            this.questions.push(choiceQuestion);
          } else if (question.questionType == QuestionType.ESSAY) {
            this.questions.push(question);
          }
        });
        this.questionForm = this.toFormGroup(this.questions);
      });
  }

  asChoiceQuestion(qIndex: number): ChoiceQuestion {
    return this.questions[qIndex] as ChoiceQuestion;
  }

  asEssayQuestion(qIndex: number): EssayQuestion {
    return this.questions[qIndex] as EssayQuestion;
  }

  createPractice() {
    let practice: Practice = {
      slug: this.slug,
      choiceAnswers: [],
      essayAnswers: [],
    };

    this.questions.forEach((question) => {
      const answerControl: FormControl = this.questionForm.controls[
        question.id
      ] as FormControl;

      if (question.questionType == QuestionType.CHOICE) {
        practice.choiceAnswers.push(answerControl.value);
      } else if (question.questionType == QuestionType.ESSAY) {
        practice.essayAnswers.push({
          questionId: question.id,
          answer: answerControl.value,
        });
      }
    });

    this.practiceService
      .createPractice(practice)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.router.navigate(["/tests"]);
        },
        error: (errors) => {
          this.errors = errors.errors;
          this.isSubmitting = false;
        },
      });
  }

  deleteTest() {
    this.testService
      .delete(this.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.router.navigate(["/tests"]);
        },
        error: (errors) => {
          this.errors = errors.errors;
          this.isSubmitting = false;
        },
      });
  }
}
