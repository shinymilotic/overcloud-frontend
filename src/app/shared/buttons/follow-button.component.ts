import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { switchMap, takeUntil } from "rxjs/operators";
import { EMPTY, Observable, Subject } from "rxjs";
import { ProfileService } from "../../core/services/profile.service";
import { UserService } from "../../core/services/user.service";
import { Profile } from "../../core/models/auth/profile.model";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-follow-button",
  templateUrl: "./follow-button.component.html",
  styleUrls: ["./follow-button.component.css"],
  imports: [NgClass],
  standalone: true,
})
export class FollowButtonComponent implements OnDestroy {
  @Input() profile!: Profile;
  @Output() toggle = new EventEmitter<Profile>();
  isSubmitting = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFollowing(): void {
    this.isSubmitting = true;

    if (!this.userService.userSignal()) {
        this.router.navigate(["/login"]);
    }

    this.toggleFollow(this.profile.following)
      .subscribe({
        next: (profile: Profile) => {
          this.isSubmitting = false;
          this.toggle.emit(profile);
        },
        error: () => (this.isSubmitting = false),
      });
  }

  public toggleFollow(following: boolean): Observable<Profile> {
    if (!following) {
      return this.profileService.follow(this.profile.username);
    } else {
      return this.profileService.unfollow(this.profile.username);
    }
  }
}
