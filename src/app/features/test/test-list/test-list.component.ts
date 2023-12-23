import { NgForOf, CommonModule, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLinkActive, RouterLink } from "@angular/router";
import { Errors } from "src/app/core/models/errors.model";
import { TestListResponse } from "src/app/core/models/test/test-list-response.model";
import { TestService } from "src/app/core/services/test.service";

@Component({
  selector: "app-test-list",
  templateUrl: "./test-list.component.html",
  styleUrls: ["./test-list.component.css"],
  imports: [RouterLinkActive, RouterLink, NgForOf, CommonModule, NgIf],
  standalone: true,
})
export class TestListComponent {
  errors!: Errors[];
  tests: TestListResponse[] = [];

  constructor(private readonly testService: TestService) {}

  ngOnInit() {
    this.testService.get().subscribe({
      next: (data) => {
        this.tests = data;
      },
      error: (err) => {
        this.errors = err;
      },
    });
  }
}
