import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleListConfig } from "../models/blog/article-list-config.model";
import { Article } from "../models/blog/article.model";
import { SearchParam } from "../models/search.model";

@Injectable({ providedIn: "root" })
export class SearchService {
  private subject = new Subject<string>();

  constructor(private readonly http: HttpClient) {}

  search(config: SearchParam): Observable<{ articles: Article[], articlesCount: number }> {
    let params = new HttpParams();
    Object.keys(config).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config[key]);
    });

    return this.http.get<{ articles: Article[], articlesCount: number }>("/searchArticles", {
      params,
    });
  }

  sendMessage(message: string) {
    this.subject.next(message);
  }

  clearMessages() {
      this.subject.next('');
  }

  getMessage(): Observable<string> {
      return this.subject.asObservable();
  }
}
