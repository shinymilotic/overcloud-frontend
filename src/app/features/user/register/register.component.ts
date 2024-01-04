import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgIf } from "@angular/common";
import { ListErrorsComponent } from "../../../shared/list-errors.component";
import { Errors } from "../../../core/models/errors.model";
import { UserService } from "../../../core/services/user.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { SideBarComponent } from "../../side-bar/side-bar.component";
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
    imports: [RouterLink, NgIf, ListErrorsComponent, ReactiveFormsModule, SideBarComponent]
})
export class RegisterComponent implements OnInit, OnDestroy {
  title = "";
  errors!: Errors[];
  isSubmitting = false;
  authForm: FormGroup<RegisterFrom>;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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
    this.title = "Đăng kí";
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
      next: () => void this.router.navigate(["/"]),
      error: ({ errors }) => {
        this.errors = errors;
        this.isSubmitting = false;
      },
    });
  }
}
