import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Article } from 'src/app/core/models/blog/article.model';
import { LoadingState } from 'src/app/core/models/loading-state.model';
import { SearchParam } from 'src/app/core/models/search.model';
import { SearchService } from 'src/app/core/services/search.service';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { NgIf, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.css'],
    standalone: true,
    imports: [
      SideBarComponent,
      NgIf,
      RouterLink,
      AsyncPipe,
      RouterLinkActive,
      RouterOutlet
    ]
})
export class SearchResultComponent implements OnInit, OnDestroy{
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
      console.log(this.q);
    });
    // this.subscription = this.searchService.getMessage().subscribe(message => {
    //   if (message) {
    //     this.message = message;
    //   }
    // });
  }

  ngOnDestroy() {
  }

  search() {
    const param: SearchParam = {
      q: this.message,
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
