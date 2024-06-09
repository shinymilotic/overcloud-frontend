import { NgForOf, CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { RouterLinkActive, RouterLink } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { Errors } from "src/app/core/models/errors.model";
import { TestListResponse } from "src/app/core/models/test/test-list-response.model";
import { TestService } from "src/app/core/services/test.service";

@Component({
    selector: "app-test-list",
    templateUrl: "./test-list.component.html",
    styleUrls: ["./test-list.component.css"],
    standalone: true,
    imports: [RouterLinkActive, RouterLink, NgForOf, CommonModule]
})
export class TestListComponent implements OnDestroy {
  errors!: Errors[];
  tests: TestListResponse[] = [];
  destroy$ = new Subject<void>();

  constructor(private readonly testService: TestService) {}

  ngOnInit() {
    this.testService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.tests = data;
        },
        error: (err) => {
          this.errors = err;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
