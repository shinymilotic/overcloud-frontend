import { NgFor } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserPractice } from "src/app/core/models/test/user-practices.model";
import { PracticeService } from "src/app/core/services/practice.service";

@Component({
  selector: "app-user-practice",
  templateUrl: "./user-practice.component.html",
  styleUrls: ["./user-practice.component.css"],
  imports: [NgFor],
  standalone: true,
})
export class UserPracticeComponent implements OnInit {
  practices: UserPractice[] = [];

  constructor(
    private readonly practiceService: PracticeService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    const username = this.getUsername();
    this.practiceService.getPractices(username).subscribe({
      next: (practices) => {
        this.practices = practices;
      },
      error: (errors) => {
        // this.isSubmitting = false;
        // this.commentFormErrors = errors;
      },
    });
  }

  getUsername() {
    return this.route.parent?.snapshot.params["username"];
  }
}
