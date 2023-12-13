import { NgForOf, CommonModule, NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
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
import { combineLatest, catchError, throwError } from "rxjs";
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
  test: TestResponse = {
    title: "",
    slug: "",
    questions: [],
  };

  practiceForm: FormGroup = this.fb.group({
    answers: this.fb.array([{}]),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly practiceService: PracticeService
  ) {}

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
        this.test = test;
        this.getChoiceQuestion.forEach((question: ChoiceQuestion) =>
          question.answers.forEach((answer) => {
            this.getAnswers().push(this.fb.control("", Validators.required));
            console.log(answer);
          })
        );
        this.currentUser = currentUser;
      });
  }

  get getChoiceQuestion(): Array<ChoiceQuestion> {
    let choiceQuestion: Array<ChoiceQuestion> = [];
    this.test.questions.forEach((question: Question) => {
      if (question.questionType == QuestionType.CHOICE) {
        choiceQuestion.push(question as ChoiceQuestion);
      }
    });

    return choiceQuestion;
  }

  getAnswers(): FormArray {
    return this.practiceForm.get("answers") as FormArray;
  }

  createPractice() {
    let answers: string[] = this.practiceForm.value.answers.filter(
      (answer: string) => answer != ""
    );

    const practice: Practice = {
      slug: this.test.slug,
      answers: answers,
    };

    this.practiceService.createPractice(practice).subscribe({
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
    this.testService.delete(this.test.slug).subscribe({
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
