import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { combineLatest, of, Subject, throwError } from "rxjs";
import { UserService } from "../../../core/services/user.service";
import { Profile } from "../../../core/models/auth/profile.model";
import { ProfileService } from "../../../core/services/profile.service";
import { FollowButtonComponent } from "../../../shared/buttons/follow-button.component";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "app-profile-page",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
    standalone: true,
    imports: [
        FollowButtonComponent,
        RouterLink,
        AsyncPipe,
        RouterLinkActive,
        RouterOutlet,
    ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile!: Profile;
  isUser: boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService
      .get(this.route.snapshot.params["username"])
      .pipe(
        catchError((error) => {
          void this.router.navigate(["/"]);
          return throwError(() => error);
        }),
      )
      .subscribe((profile) => {
        this.profile = profile;
        this.isUser = profile.username === this.userService.userSignal()?.username;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleFollowing(profile: Profile) {
    this.profile = profile;
  }
}
