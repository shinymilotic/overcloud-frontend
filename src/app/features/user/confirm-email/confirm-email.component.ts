import { Component, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ListErrorsComponent } from "../../../shared/list-errors.component";
import { UserService } from "src/app/core/services/user.service";
import { Errors } from "src/app/core/models/errors.model";
@Component({
    selector: "app-confirm-email",
    templateUrl: "./confirm-email.component.html",
    styleUrls: ["./confirm-email.component.css"],
    standalone: true,
    imports: [RouterLink, ListErrorsComponent, ReactiveFormsModule]
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  private isConfirmed: boolean = false;
  private errors!: Errors[];

  constructor(private route: ActivatedRoute,
    private readonly userService: UserService) {
  }

  ngOnInit(): void {
    const token :string = this.route.snapshot.params["token"];
    this.userService.confirmEmail(token).subscribe({
      next: (isConfirm: boolean) => {
        if (isConfirm) {
          this.isConfirmed = true;
        }
      },
      error: (errors) => {
        this.errors = errors.errors;
      }
    });
  }

  getIsConfirmed() : boolean {
    return this.isConfirmed;
  }

  ngOnDestroy() {
  }
}
