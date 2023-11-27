import { Component } from "@angular/core";
import { Errors } from "src/app/core/models/errors.model";
import { TestService } from "src/app/core/services/test.service";

@Component({
  selector: "app-test-list",
  templateUrl: "./test-list.component.html",
  styleUrls: ["./test-list.component.css"],
  standalone: true,
})
export class TestListComponent {
  errors!: Errors[];
  constructor(private readonly testService: TestService) {}

  ngOnInit() {
    this.testService.get().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        this.errors = err;
      },
    });
  }
}
