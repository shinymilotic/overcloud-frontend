import { Component, OnDestroy } from "@angular/core";
import { Article } from "../../../core/models/blog/article.model";
import { SearchService } from "../../../core/services/search.service";
import { SearchParam } from "../../../core/models/search.model";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ActivatedRoute } from "@angular/router";
import { NgIf } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"],
  imports: [FontAwesomeModule, FormsModule, NgIf, ReactiveFormsModule 
  ],
  standalone: true,
})
export class SearchBarComponent implements OnDestroy {
  results: Article[] = [];
  
  searchInput: FormControl<string> = new FormControl('', { nonNullable: true });
  searchForm: FormGroup = this.fb.group({
    searchInput: this.searchInput
  }
    );
  searchReturned = false;
  searchParam: SearchParam | any;
  destroy$ = new Subject<void>();
  faSearch = faSearch;
  
  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private readonly router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    const searchInput :string = this.searchForm.get("searchInput")?.value;
    // this.router.navigate(["/search/articles"], {queryParams: {q: searchInput}}).then(() => {
    //   window.location.reload();
    // });;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/search/articles'], {queryParams: {q: searchInput}});
    }).catch((err) => {console.log(err)});
  }
}
