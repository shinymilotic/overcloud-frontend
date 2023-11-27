import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";
import { Test } from "../models/test.model";

@Injectable({ providedIn: "root" })
export class TestService {
  constructor(private readonly http: HttpClient) {}

  // get(slug: string): Observable<Test> {
  //   return this.http
  //     .get<{ article: Article }>(`/articles/${slug}`)
  //     .pipe(map((data) => data.article));
  // }

  // delete(slug: string): Observable<void> {
  //   // return this.http.delete<void>(`/articles/${slug}`);
  // }

  get(): Observable<Test[]> {
    return this.http
      .get<{ tests: Test[] }>("/tests")
      .pipe(map((data) => data.tests));
  }

  create(test: Partial<Test>): Observable<string> {
    return this.http
      .post<string>("/test", { test: test })
      .pipe(map((data) => data));
  }

  // update(article: Partial<Article>): Observable<Article> {
  //   return this.http
  //     .put<{ article: Article }>(`/articles/${article.slug}`, {
  //       article: article,
  //     })
  //     .pipe(map((data) => data.article));
  // }
}
