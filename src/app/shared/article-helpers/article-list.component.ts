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
import { Subject } from "rxjs";
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
  lastArticleId = 'a373d706-8fe0-4610-bfcf-7742b2d5ace8';
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroy$ = new Subject<void>();
  q: string = "";

  @Input() limit!: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.lastArticleId = 'a373d706-8fe0-4610-bfcf-7742b2d5ace8';
      this.runQuery(this.lastArticleId);
    }
  }

  constructor(
    private articlesService: ArticlesService,
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setPageTo(lastArticleId: string) {
    // this.runQuery(pageNumber);
    this.loading = LoadingState.LOADING;
    // this.results = [];
    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.size = this.limit;
      this.query.filters.lastArticleId = lastArticleId;
    }

    this.route.queryParamMap.subscribe((params: any) => {
      this.q = params["params"].q;
    });

    if (this.q != undefined && this.q != "" && this.q != null) {
      const param: SearchParam = {
        q: this.q,
        size: this.limit,
        lastArticleId: lastArticleId,
      };

      this.searchService
        .search(param)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.loading = LoadingState.LOADED;
          if (data.articles.length != 0) {
            data.articles.forEach((element) => {
              this.results.push(element);
            });
            this.lastArticleId = lastArticleId;
          }
        });
    } else {
      this.articlesService
        .query(this.query)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.loading = LoadingState.LOADED;
          if (data.articles.length != 0) {
            data.articles.forEach((element) => {
              this.results.push(element);
            });
            this.lastArticleId = lastArticleId;
          }
        });
    }
  }

  runQuery(lastArticleId: string) {
    this.loading = LoadingState.LOADING;
    if (this.limit) {
      this.query.filters.size = this.limit;
      this.query.filters.lastArticleId = lastArticleId;
    }

    this.route.queryParamMap.subscribe((params: any) => {
      this.q = params["params"].q;
    });

    if (this.q != undefined && this.q != "" && this.q != null) {
      const param: SearchParam = {
        q: this.q,
        size: this.limit,
        lastArticleId: lastArticleId,
      };

      this.searchService
        .search(param)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.loading = LoadingState.LOADED;
          this.results = data.articles;
        });
    } else {
      this.articlesService
        .query(this.query)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.loading = LoadingState.LOADED;
          this.results = data.articles;
        });
    }
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
      // this.setPageTo(this.currentPage + 1);
    }
  }
}
