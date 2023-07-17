import { Component } from "@angular/core";
import {
  faAngleLeft,
  faAngleRight,
  faIcons,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  selector: "app-tags-slider",
  templateUrl: "./tags-slider.component.html",
  styleUrls: ["./tags-slider.component.css"],
  standalone: true,
  imports: [FontAwesomeModule],
})
export class TagsSliderComponent {
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy() {}
}
