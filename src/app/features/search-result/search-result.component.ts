import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Article } from 'src/app/core/models/blog/article.model';
import { LoadingState } from 'src/app/core/models/loading-state.model';
import { SearchParam } from 'src/app/core/models/search.model';
import { SearchService } from 'src/app/core/services/search.service';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.css'],
    standalone: true,
    imports: [
      SideBarComponent,
      RouterLink,
      AsyncPipe,
      RouterLinkActive,
      RouterOutlet
    ]
})
export class SearchResultComponent implements OnInit{
  loading = LoadingState.NOT_LOADED;
  LoadingState = LoadingState;
  destroy$ = new Subject<void>();
  q: string = '';

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.q = params['q'];
    });
  }
}
