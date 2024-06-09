import { Component, Input, OnInit } from "@angular/core";
import { PracticeService } from "src/app/core/services/practice.service";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { PracticeResult } from "./PracticeResult";
import { Question } from "./Question";
import { ChoiceResult } from "./ChoiceQuestion";
import { Answer } from "./Answer";
import { ChoiceAnswer } from "./ChoiceAnswer";
import { EssayAnswer } from "./EssayAnswer";
import { EssayResult } from "./EssayQuestion";

@Component({
    selector: "app-practice-result",
    templateUrl: "./practice-result.component.html",
    styleUrls: ["./practice-result.component.css"],
    standalone: true,
    imports: []
})
export class PracticeResultComponent implements OnInit {
  
  @Input() username!: string;
  @Input() id!: string;
  practiceResult: PracticeResult = {
    testTitle: '',
    questions: []
  };

  constructor(
    private readonly practiceService: PracticeService,
    private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.practiceService.getPractice(this.id).subscribe((data: PracticeResult) => {
      console.log(data);

      this.practiceResult = data;
    });
  }

  asChoiceQuestion(question: Question): ChoiceResult {
    return question as ChoiceResult;
  }

  asEssayQuestion(question: Question): EssayResult {
    return question as EssayResult;
  }

  paintColor(answer: ChoiceAnswer): string {
    if (answer.choice == true && answer.truth == true) {
      return "success";
    }
    
    if (answer.choice == true && answer.truth == false) {
      return "fail";
    }

    return "";
  }
}
