import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ArticlesService } from "../../core/services/articles.service";
import { ArticleListConfig } from "../../core/models/blog/article-list-config.model";
import { Article } from "../../core/models/blog/article.model";
import { ArticlePreviewComponent } from "./article-preview.component";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { LoadingState } from "../../core/models/loading-state.model";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { SearchService } from "src/app/core/services/search.service";
import { SearchParam } from "src/app/core/models/search.model";
@Component({
  selector: "app-article-list",
  styleUrls: ["article-list.component.css"],
  templateUrl: "./article-list.component.html",
  imports: [ArticlePreviewComponent, NgForOf, NgClass, NgIf],
  standalone: true,
})
export class ArticleListComponent implements OnDestroy, OnInit {
  query!: ArticleListConfig;
  results: Article[] = [];
  lastArticleId : string | undefined = '';
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroy$ = new Subject<void>();
  subscription!: Subscription;

  @Input() limit!: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.lastArticleId = '';
      this.results = [];
      this.runQuery();
    }
  }

  constructor(
    private articlesService: ArticlesService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  runQuery() {
    this.loading = LoadingState.LOADING;
    if (this.limit) {
      this.query.filters.size = this.limit;
      this.query.filters.lastArticleId = this.lastArticleId;
    }
  
    this.articlesService
      .query(this.query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loading = LoadingState.LOADED;
        this.results.push(...data.articles);
        if (data.articles != undefined && data.articles.length > 0) {
          this.lastArticleId = data.articles.at(data.articlesCount - 1)?.id;
        }
      });
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1 && this.loading == LoadingState.LOADED) {
      this.runQuery();
    }
  }
}
