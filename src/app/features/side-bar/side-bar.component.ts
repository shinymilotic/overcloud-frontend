import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { SidebarService } from "../../core/services/sidebar.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"],
  imports: [RouterLink],
  standalone: true,
})
export class SideBarComponent {
  isOpen = true;
  @ViewChild("menu") menu!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private readonly sidebarService: SidebarService
  ) {
    
  }

  ngOnInit() {
    this.sidebarService.isToggleSidebar.subscribe(() => {
      this.toggleSidebar();
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
