import { Component, EventEmitter, Output, inject } from "@angular/core";
import { UserService } from "../../core/services/user.service";
import { ActivatedRoute, RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { SearchBarComponent } from "./search-bar/search-bar.component";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, distinctUntilChanged, map } from "rxjs";
import { SideBarComponent } from "src/app/features/side-bar/side-bar.component";
import { SidebarService } from "../../core/services/sidebar.service";
import { ActionService } from "../../core/services/action.service";

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
  // mySubscription;

  constructor(
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly sidebarService: SidebarService
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.mySubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     // Trick the Router into believing it's last link wasn't previously loaded
    //     this.router.navigated = false;
    //   }
    // });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
    // if (this.mySubscription) {
    //   this.mySubscription.unsubscribe();
    // }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  refreshPage() {
    this.router.navigateByUrl("/");
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    this.router.navigate([uri]));
  }
}
