import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ArticlesService } from "../../core/services/articles.service";
import { ArticleListConfig } from "../../core/models/article-list-config.model";
import { Article } from "../../core/models/article.model";
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
  currentPage = 1;
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroy$ = new Subject<void>();
  q: string = "";

  @Input() limit!: number;
  @Input()
  set config(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
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

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = LoadingState.LOADING;
    this.results = [];

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.size = this.limit;
      this.query.filters.page = this.currentPage;
    }

    this.route.queryParamMap.subscribe((params: any) => {
      this.q = params["params"].q;
    });

    if (this.q != undefined && this.q != "" && this.q != null) {
      const param: SearchParam = {
        q: this.q,
        size: this.limit,
        page: this.currentPage,
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
}
