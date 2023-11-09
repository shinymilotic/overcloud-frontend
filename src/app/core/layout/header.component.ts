import { Component, EventEmitter, Output, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { SearchBarComponent } from "../../search-bar/search-bar.component";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { SideBarComponent } from "src/app/side-bar/side-bar.component";
import { SidebarService } from "../services/sidebar.service";

@Component({
  selector: "app-layout-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    AsyncPipe,
    NgIf,
    ShowAuthedDirective,
    SearchBarComponent,
    SideBarComponent,
  ],
})
export class HeaderComponent {
  currentUser$ = inject(UserService).currentUser;
  messages!: string[];
  private destroy$ = new Subject();
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  constructor(
    private readonly router: Router,
    private readonly sidebarService: SidebarService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  onConnected(): void {
    console.log("Connected");
  }

  onError(): void {
    console.log("Error");
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
