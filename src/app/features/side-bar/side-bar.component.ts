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
    /**
     * This events get called by all clicks on the page
     */
    this.renderer.listen("window", "click", (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (e.target != this.menu.nativeElement) {
        //  this.isOpen = false;
      }
    });
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
