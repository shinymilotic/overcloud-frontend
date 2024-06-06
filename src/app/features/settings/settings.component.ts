import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
import { InputTextModule } from 'primeng/inputtext';
import { InputText} from 'primeng/inputtext';
import { FloatLabelModule} from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
    selector: "app-settings-page",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"],
    standalone: true,
    imports: [ListErrorsComponent, ReactiveFormsModule, SideBarComponent, InputTextModule, FloatLabelModule]
})
export class SettingsComponent implements OnInit {
  user!: User;
  settingsForm: FormGroup<SettingsForm>;
  errors!: Errors[];
  isSubmitting = false;

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
  }

  submitForm() {
    this.isSubmitting = true;

    this.userService
      .update(this.settingsForm.value)
      .subscribe({
        next: (user) => void this.router.navigate(["/@".concat(user.username)]),
        error: (err) => {
          this.errors = err.errors;
          this.isSubmitting = false;
        },
      });
  }
}
