import { NgFor } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Errors } from "src/app/core/models/errors.model";
import { UserPractice } from "src/app/core/models/test/user-practices.model";
import { PracticeService } from "src/app/core/services/practice.service";

@Component({
  selector: "app-user-practice",
  templateUrl: "./user-practice.component.html",
  styleUrls: ["./user-practice.component.css"],
  imports: [NgFor, RouterLink],
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
    this.practiceService.getPractices(username).subscribe((practices) => {
      this.practices = practices;
    });
  }

  getUsername(): string {
    return this.route.parent?.snapshot.params["username"];
  }
}
