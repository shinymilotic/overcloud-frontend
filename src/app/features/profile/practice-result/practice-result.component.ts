import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-practice-result",
  templateUrl: "./practice-result.component.html",
  styleUrls: ["./practice-result.component.css"],
  standalone: true,
})
export class PracticeResultComponent implements OnInit {
  @Input() username!: string;

  ngOnInit(): void {
    console.log("dsdsadas");
  }
}
