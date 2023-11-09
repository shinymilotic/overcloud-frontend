import { RxLet } from "@rx-angular/template/let";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { TagsService } from "../../core/services/tags.service";
import { ArticleListConfig } from "../../core/models/article-list-config.model";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { ArticleListComponent } from "../../shared/article-helpers/article-list.component";
import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { UserService } from "../../core/services/user.service";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SideBarComponent } from "src/app/side-bar/side-bar.component";

@Component({
  selector: "app-home-page",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  imports: [
    NgClass,
    ArticleListComponent,
    AsyncPipe,
    RxLet,
    NgForOf,
    ShowAuthedDirective,
    RouterLink,
    RouterLinkActive,
    SideBarComponent,
  ],
  standalone: true,
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  listConfig: ArticleListConfig = {
    filters: {},
  };
  tags$ = inject(TagsService)
    .getAll()
    .pipe(tap(() => (this.tagsLoaded = true)));
  tagsLoaded = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {
    this.userService.isAuthenticated
      .pipe(
        tap((isAuthenticated) => {
          if (isAuthenticated) {
            this.setListTo();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setListTo(filters: Object = {}): void {
    // If feed is requested but user is not authenticated, redirect to login
    if (!this.isAuthenticated) {
      void this.router.navigate(["/login"]);
      return;
    }

    // Otherwise, set the list object
    this.listConfig = { filters: filters };
  }
}
