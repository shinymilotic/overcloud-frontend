import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable, Subject, of, switchMap } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { NgClass } from "@angular/common";
import { ArticlesService } from "../../core/services/articles.service";
import { UserService } from "../../core/services/user.service";
import { Article } from "../../core/models/blog/article.model";

@Component({
  selector: "app-favorite-button",
  templateUrl: "./favorite-button.component.html",
  styleUrls: ["./favorite-button.component.css"],
  imports: [NgClass],
  standalone: true,
})
export class FavoriteButtonComponent implements OnDestroy {
  destroy$ = new Subject<void>();
  isSubmitting = false;

  @Input() article!: Article;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly articleService: ArticlesService,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavoriteBtn($event: Event): void {
    $event.stopPropagation();
    this.isSubmitting = true;
    if (!this.userService.userSignal()) {
        this.router.navigate(["/login"]);
    }

    this.toggleFavorite(this.article.favorited)
    .subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toggle.emit(!this.article.favorited);
      },
      error: () => (this.isSubmitting = false),
    });
      
  }

  public toggleFavorite(favorited: boolean): Observable<any> {
    if (!favorited) {
      return this.articleService.favorite(this.article.slug);
    } else {
      return this.articleService.unfavorite(this.article.slug);
    }
  }
}
