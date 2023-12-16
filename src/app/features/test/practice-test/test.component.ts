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
  // test: TestResponse = {
  //   title: "",
  //   slug: "",
  //   questions: [],
  // };

  // {
  //   id: string;
  //   question: string;
  //   questionType: number;
  //   practiceForm:
  //   {
  //     answer
  //   }
  //   {
  //     answerId
  //   }
  // }
  title: string = "";
  slug: string = "";
  practiceForm: PracticeForm[] = [];
  // {questionId, answer}

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
        test.questions.forEach((question) => {
          this.slug = test.slug;
          this.title = test.title;
          this.currentUser = currentUser;

          let answer: PracticeQuestionForm;
          if (question.questionType == QuestionType.CHOICE) {
            let choiceAnswerForm: PracticeChoiceQuestionForm = {
              answers: [],
              answerId: this.fb.nonNullable.control("", Validators.required),
            };

            let choiceQuestion = question as ChoiceQuestion;
            choiceQuestion.answers.forEach((answer) => {
              choiceAnswerForm.answers.push({
                id: answer.id,
                answer: answer.answer,
              });
            });

            answer = choiceAnswerForm;

            this.practiceForm.push({
              id: question.id,
              question: question.question,
              questionType: question.questionType,
              practiceForm: answer,
            });
          } else if (question.questionType == QuestionType.ESSAY) {
            answer = {
              answer: this.fb.nonNullable.control("", Validators.required),
            };

            this.practiceForm.push({
              id: question.id,
              question: question.question,
              questionType: question.questionType,
              practiceForm: answer,
            });
          } else {
            return;
          }
        });
      });
  }

  choiceQuestionArrForm(index: number): PracticeChoiceQuestionForm {
    return this.practiceForm.at(index)
      ?.practiceForm as PracticeChoiceQuestionForm;
  }

  essayQuestionArrForm(index: number): PracticeEssayQuestionForm {
    return this.practiceForm.at(index)
      ?.practiceForm as PracticeEssayQuestionForm;
  }

  createPractice() {
    const practice: Practice = {
      slug: this.slug,
      choiceAnswers: [],
      essayAnswers: [],
    };

    this.practiceForm.forEach((form) => {
      if (form.questionType == QuestionType.CHOICE) {
        const choiceQuestion: PracticeChoiceQuestionForm =
          form.practiceForm as PracticeChoiceQuestionForm;
        practice.choiceAnswers.push(choiceQuestion.answerId.value);
      } else if (form.questionType == QuestionType.ESSAY) {
        const essayQuestion: PracticeEssayQuestionForm =
          form.practiceForm as PracticeEssayQuestionForm;
        practice.essayAnswers.push({
          questionId: form.id,
          answer: essayQuestion.answer.value,
        });
      }
    });

    // let answers: string[] = this.practiceForm.value.answers.filter(
    //   (answer: string) => answer != ""
    // );

    // const practice: Practice = {
    //   slug: this.slug,
    //   answers: answers,
    // };

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
    this.testService.delete(this.slug).subscribe({
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
