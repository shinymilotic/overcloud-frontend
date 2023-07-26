import { Component, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { SearchBarComponent } from "../../search-bar/search-bar.component";
import { ActivatedRoute, Router } from "@angular/router";

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
  ],
})
export class HeaderComponent {
  currentUser$ = inject(UserService).currentUser;
  constructor(private readonly router: Router) {}
}
