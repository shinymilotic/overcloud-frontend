import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";
import { SearchParam } from "../models/search.model";

@Injectable({ providedIn: "root" })
export class SearchService {
  constructor(private readonly http: HttpClient) {}

  search(config: SearchParam): Observable<{ articles: Article[] }> {
    let params = new HttpParams();
    Object.keys(config).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config[key]);
    });

    return this.http.get<{ articles: Article[] }>("/searchArticles", {
      params,
    });
  }
}
