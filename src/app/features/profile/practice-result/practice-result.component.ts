import { Component, Input, OnInit } from "@angular/core";
import { PracticeService } from "src/app/core/services/practice.service";
import { SideBarComponent } from "../../side-bar/side-bar.component";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Question } from "src/app/core/models/test/question.model";
import { ChoiceQuestion } from "src/app/core/models/test/choicequestion.model";
import { PracticeResult } from "./PracticeResult";

@Component({
    selector: "app-practice-result",
    templateUrl: "./practice-result.component.html",
    styleUrls: ["./practice-result.component.css"],
    standalone: true,
    imports: [SideBarComponent]
})
export class PracticeResultComponent implements OnInit {
  @Input() username!: string;
  @Input() id!: string;
  practiceResult!: PracticeResult;

  constructor(
    private readonly practiceService: PracticeService,
    private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.practiceService.getPractice(this.id).subscribe((data: PracticeResult) => {
      console.log(data);
    });
  }
}
