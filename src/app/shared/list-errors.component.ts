import { Component, Input } from "@angular/core";
import { Errors } from "../core/models/errors.model";
import { NgForOf } from "@angular/common";

@Component({
  selector: "app-list-errors",
  templateUrl: "./list-errors.component.html",
  styleUrls: ["./list-errors.component.css"],
  imports: [NgForOf],
  standalone: true,
})
export class ListErrorsComponent {
  errorList: Errors[] = [];

  @Input() set errors(errorList: Errors[]) {
    this.errorList = errorList;
  }
}
