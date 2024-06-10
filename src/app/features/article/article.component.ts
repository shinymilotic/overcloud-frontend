import { Component, OnDestroy, OnInit, Signal, computed } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { User } from "../../core/models/auth/user.model";
import { Article } from "../../core/models/blog/article.model";
import { ArticlesService } from "../../core/services/articles.service";
import { CommentsService } from "../../core/services/comments.service";
import { UserService } from "../../core/services/user.service";
import { ArticleMetaComponent } from "../../shared/article-helpers/article-meta.component";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { FollowButtonComponent } from "../../shared/buttons/follow-button.component";
import { FavoriteButtonComponent } from "../../shared/buttons/favorite-button.component";
import { ListErrorsComponent } from "../../shared/list-errors.component";
import { ArticleCommentComponent } from "./article-comment.component";
import { catchError, map, takeUntil } from "rxjs/operators";
import { Subject, combineLatest, throwError } from "rxjs";
import { Comment } from "../../core/models/blog/comment.model";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { Errors } from "../../core/models/errors.model";
import { Profile } from "../../core/models/auth/profile.model";

@Component({
    selector: "app-article-page",
    templateUrl: "./article.component.html",
    styleUrls: ['./article.component.css'],
    standalone: true,
    imports: [
        ArticleMetaComponent,
        RouterLink,
        NgClass,
        FollowButtonComponent,
        FavoriteButtonComponent,
        NgForOf,
        AsyncPipe,
        ListErrorsComponent,
        FormsModule,
        ArticleCommentComponent,
        ReactiveFormsModule,
        ShowAuthedDirective,
    ]
})
export class ArticleComponent implements OnInit, OnDestroy {
  article!: Article;
  comments: Comment[] = [];

  canModify: Signal<boolean> = computed(() => {
    if (this.userService.userSignal()?.username === this.article.author.username) {
      return true;
    }

    return false;
  });  

  commentControl: FormControl<string>;
  commentFormErrors: Errors | null = null;
  bodyAsHtml!: string;
  isSubmitting = false;
  isDeleting = false;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly articleService: ArticlesService,
    private readonly commentsService: CommentsService,
    private readonly router: Router,
    public readonly userService: UserService
  ) {
    this.commentControl = new FormControl<string>("", { nonNullable: true });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.params["slug"];
    combineLatest([
      this.articleService.get(slug),
      this.commentsService.getAll(slug)
    ])
      .pipe(
        catchError((err) => {
          void this.router.navigate(["/"]);
          return throwError(() => err);
        })
      )
      .subscribe(([article, comments]) => {
        this.article = article;
        this.comments = comments;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleFavorite(favorited: boolean): void {
    this.article.favorited = favorited;

    if (favorited) {
      this.article.favoritesCount++;
    } else {
      this.article.favoritesCount--;
    }
  }

  toggleFollowing(profile: Profile): void {
    this.article.author.following = profile.following;
  }

  deleteArticle(): void {
    this.isDeleting = true;

    this.articleService
      .delete(this.article.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        void this.router.navigate(["/"]);
      });
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = null;

    this.commentsService
      .add(this.article.slug, this.commentControl.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment) => {
          this.comments.unshift(comment);
          this.commentControl.reset("");
          this.isSubmitting = false;
        },
        error: (errors) => {
          this.isSubmitting = false;
          this.commentFormErrors = errors;
        },
      });
  }

  deleteComment(comment: Comment): void {
    this.commentsService
      .delete(comment.id, this.article.slug)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.comments = this.comments.filter((item) => item !== comment);
      });
  }

  trackById(index: number, item: Comment): string {
    return item.id;
  }
}
