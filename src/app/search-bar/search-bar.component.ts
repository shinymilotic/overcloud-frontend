import { Component, OnDestroy } from "@angular/core";
import { Article } from "../core/models/article.model";
import { SearchService } from "../core/services/search.service";
import { SearchParam } from "../core/models/search.model";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ActivatedRoute } from "@angular/router";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"],
  imports: [FontAwesomeModule, FormsModule, NgIf],
  standalone: true,
})
export class SearchBarComponent implements OnDestroy {
  results: Article[] = [];
  searchInput: string = "";
  searchReturned = false;
  searchParam: SearchParam | any;
  destroy$ = new Subject<void>();
  faSearch = faSearch;
  constructor(
    private searchService: SearchService,
    private readonly router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: any) => {
      if (params["params"].q != undefined) {
        this.searchInput = params["params"].q;
      }
    });
  }

  onSearch() {
    // this.searchService.search(this.searchParam)
    // .pipe(takeUntil(this.destroy$))
    // .subscribe((data) => {
    //   this.results = data.articles;
    // });
    this.router.navigate(["/"], { queryParams: { q: this.searchInput } });
  }
}
