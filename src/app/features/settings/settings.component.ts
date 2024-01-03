import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../core/models/auth/user.model";
import { UserService } from "../../core/services/user.service";
import { ListErrorsComponent } from "../../shared/list-errors.component";
import { Errors } from "../../core/models/errors.model";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { SettingsForm } from "./SettingsForm";
import { SideBarComponent } from "../side-bar/side-bar.component";

@Component({
    selector: "app-settings-page",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"],
    standalone: true,
    imports: [ListErrorsComponent, ReactiveFormsModule, SideBarComponent]
})
export class SettingsComponent implements OnInit, OnDestroy {
  user!: User;
  settingsForm: FormGroup<SettingsForm>;
  errors!: Errors[];
  isSubmitting = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    this.settingsForm = new FormGroup<SettingsForm>({
      image: new FormControl("", { nonNullable: true }),
      username: new FormControl("", { nonNullable: true }),
      bio: new FormControl("", { nonNullable: true }),
      email: new FormControl("", { nonNullable: true }),
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((data) => {
      this.settingsForm.patchValue(data);
    });
    // this.settingsForm.patchValue(
    //   this.userService.getCurrentUser() as Partial<User>
    // );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.userService.logout();
  }

  submitForm() {
    this.isSubmitting = true;

    this.userService
      .update(this.settingsForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => void this.router.navigate(["/@".concat(user.username)]),
        error: (err) => {
          this.errors = err.errors;
          this.isSubmitting = false;
        },
      });
  }
}
