import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ListErrorsComponent } from "../../../shared/list-errors.component";
import { UserService } from "../../../core/services/user.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ApiError } from "src/app/core/models/apierrors.model";
interface RegisterFrom {
  email: FormControl<string>;
  password: FormControl<string>;
  username?: FormControl<string>;
}
@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"],
    standalone: true,
    imports: [RouterLink, ListErrorsComponent, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit, OnDestroy {
  title = "";
  errors!: ApiError;
  isSubmitting = false;
  authForm: FormGroup<RegisterFrom>;
  isRegisterSuccess: boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly userService: UserService
  ) {
    // use FormBuilder to create a form group
    this.authForm = new FormGroup<RegisterFrom>({
      email: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      password: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  ngOnInit(): void {
    this.title = "Register";
    this.authForm.addControl(
      "username",
      new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    this.isSubmitting = true;
    // this.errors = { errors: {} };

    let observable = this.userService.register(
      this.authForm.value as {
        email: string;
        password: string;
        username: string;
      }
    );

    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.isRegisterSuccess = true,
      error: (error: ApiError) => {
        console.log(error);
        // if (error.data == null) {
        //   this.errors = [{messageId: error.code, message: error.message}];
        // } else {
        //    = error.data.errors;
        // }
        this.errors = error;
        this.isSubmitting = false;
      },
    });
  }
}
