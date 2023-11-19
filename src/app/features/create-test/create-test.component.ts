import { Component } from "@angular/core";
import { Errors } from "src/app/core/models/errors.model";
import { ListErrorsComponent } from "src/app/shared/list-errors.component";
import { CreateTestForm } from "./CreateTestForm";

@Component({
  selector: "app-create-test",
  templateUrl: "./create-test.component.html",
  styleUrls: ["./create-test.component.css"],
  imports: [ListErrorsComponent],
  standalone: true,
})
export class CreateTestComponent {
  isSubmitting = false;
  errors!: Errors[];
  test: CreateTestForm = {
    question: [],
  };

  constructor() {}

  addQuestion() {
    this.test.question.push({
      question: "",
      answers: [],
    });
  }

  submitForm() {
    throw new Error("Method not implemented.");
  }
}
