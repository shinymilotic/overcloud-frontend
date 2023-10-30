import { Component } from "@angular/core";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"],
  standalone: true,
})
export class SideBarComponent {
  isOpen = false;

  constructor() {}

  ngOnInit() {}

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
