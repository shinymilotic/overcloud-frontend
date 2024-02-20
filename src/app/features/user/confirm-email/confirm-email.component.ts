import { Component, OnDestroy, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgIf } from "@angular/common";
import { ListErrorsComponent } from "../../../shared/list-errors.component";
import { SideBarComponent } from "../../side-bar/side-bar.component";
@Component({
    selector: "app-confirm-email",
    templateUrl: "./confirm-email.component.html",
    styleUrls: ["./confirm-email.component.css"],
    standalone: true,
    imports: [RouterLink, NgIf, ListErrorsComponent, ReactiveFormsModule, SideBarComponent]
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }
}
