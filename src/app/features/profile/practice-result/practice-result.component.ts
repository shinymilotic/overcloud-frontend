import { Component, Input, OnInit } from "@angular/core";
import { PracticeService } from "src/app/core/services/practice.service";

@Component({
  selector: "app-practice-result",
  templateUrl: "./practice-result.component.html",
  styleUrls: ["./practice-result.component.css"],
  standalone: true,
})
export class PracticeResultComponent implements OnInit {
  @Input() username!: string;
  @Input() id!: string;

  constructor(private readonly practiceService: PracticeService) {}

  ngOnInit(): void {
    this.practiceService.getPractice(this.id).subscribe(() => {});
  }
}
