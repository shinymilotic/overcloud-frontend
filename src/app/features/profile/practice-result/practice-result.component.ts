import { Component, Input, OnInit } from "@angular/core";
import { PracticeService } from "src/app/core/services/practice.service";
import { SideBarComponent } from "../../side-bar/side-bar.component";

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

  constructor(private readonly practiceService: PracticeService) {}

  ngOnInit(): void {
    this.practiceService.getPractice(this.id).subscribe((data) => {
      console.log(data);
    });
  }
}
