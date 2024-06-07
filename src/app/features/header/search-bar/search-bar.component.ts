import { Component, OnDestroy } from "@angular/core";
import { Article } from "../../../core/models/blog/article.model";
import { SearchService } from "../../../core/services/search.service";
import { SearchParam } from "../../../core/models/search.model";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { NgIf } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"],
  imports: [ FormsModule, NgIf, ReactiveFormsModule 
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
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
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
