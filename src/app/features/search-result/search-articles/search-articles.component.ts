import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Article } from 'src/app/core/models/blog/article.model';
import { LoadingState } from 'src/app/core/models/loading-state.model';
import { SearchParam } from 'src/app/core/models/search.model';
import { SearchService } from 'src/app/core/services/search.service';
import { ArticlePreviewComponent } from "../../../shared/article-helpers/article-preview.component";
import { NgForOf } from '@angular/common';

@Component({
    selector: 'app-search-articles',
    templateUrl: './search-articles.component.html',
    styleUrls: ['./search-articles.component.css'],
    standalone: true,
    imports: [ArticlePreviewComponent, NgForOf]
})
export class SearchArticlesComponent {
  limit: number = 10;
  results: Article[] = [];
  lastArticleId : string | undefined = '';
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroy$ = new Subject<void>();
  message: string = '';
  q: string = '';

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.q = params['q'];
      this.search();
    });
  }

  ngOnDestroy() {
  }

  search() {
    const param: SearchParam = {
      q: this.q,
      size: this.limit,
      lastArticleId: this.lastArticleId,
    };

    this.searchService
      .search(param)
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
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1) {
      this.search();
    }
  }
}
