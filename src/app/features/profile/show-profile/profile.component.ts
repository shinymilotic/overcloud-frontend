import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  ActivatedRoute,
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
import { AsyncPipe, NgIf } from "@angular/common";
import { SideBarComponent } from "../../side-bar/side-bar.component";

@Component({
    selector: "app-profile-page",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.css"],
    standalone: true,
    imports: [
        FollowButtonComponent,
        NgIf,
        RouterLink,
        AsyncPipe,
        RouterLinkActive,
        RouterOutlet,
        SideBarComponent
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
        switchMap((profile) => {
          return combineLatest([of(profile), this.userService.currentUser]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([profile, user]) => {
        this.profile = profile;
        this.isUser = profile.username === user?.username;
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
