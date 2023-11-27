import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, catchError, throwError } from "rxjs";
import { TestResponse } from "src/app/core/models/test-response.model";
import { User } from "src/app/core/models/user.model";
import { TestService } from "src/app/core/services/test.service";
import { UserService } from "src/app/core/services/user.service";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.css"],
  standalone: true,
})
export class TestComponent implements OnInit {
  currentUser!: User | null;
  test!: TestResponse;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly testService: TestService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.params["slug"];
    combineLatest([this.testService.getOne(slug), this.userService.currentUser])
      .pipe(
        catchError((err) => {
          void this.router.navigate(["/"]);
          return throwError(err);
        })
      )
      .subscribe(([test, currentUser]) => {
        this.test = test;
        this.currentUser = currentUser;
      });
  }
}
