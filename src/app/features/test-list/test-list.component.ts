import { Component } from "@angular/core";

@Component({
  selector: "app-test-list",
  templateUrl: "./test-list.component.html",
  styleUrls: ["./test-list.component.css"],
  standalone: true,
})
export class TestListComponent {
  isOpen = false;

  constructor() {}

  ngOnInit() {}

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
