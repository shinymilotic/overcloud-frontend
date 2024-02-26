import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { SidebarService } from "../../core/services/sidebar.service";
import { RouterLink } from "@angular/router";
import { UserService } from "src/app/core/services/user.service";
import { EMPTY, map, switchMap } from "rxjs";
import { User } from "src/app/core/models/auth/user.model";
import { NgFor } from "@angular/common";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"],
  imports: [RouterLink, NgFor],
  standalone: true,
})
export class SideBarComponent {
  isOpen = true;
  @ViewChild("menu") menu!: ElementRef;

  public followers!: User[];

  constructor(
    private readonly userService: UserService,
    private readonly sidebarService: SidebarService
  ) {
    
  }

  ngOnInit() {
    this.sidebarService.isToggleSidebar.subscribe(() => {
      this.toggleSidebar();
    });
    this.userService.currentUser.pipe(
      switchMap((user: User | null) => {
        if (user != null) {
          return this.userService.getFollowers(user.id);
        } else {
          return EMPTY;
        }
      })
    ).subscribe((followers: User[]) => {
      this.followers = followers;
    })
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
