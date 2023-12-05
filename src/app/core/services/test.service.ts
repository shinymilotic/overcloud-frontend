import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Test } from "../models/test.model";
import { TestResponse } from "../models/test-response.model";

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

  get(): Observable<TestResponse[]> {
    return this.http
      .get<{ tests: TestResponse[] }>("/tests")
      .pipe(map((data) => data.tests));
  }

  getOne(slug: string): Observable<TestResponse> {
    return this.http
      .get<TestResponse>(`/tests/${slug}`)
      .pipe(map((data) => data));
  }

  create(test: Partial<Test>): Observable<string> {
    return this.http
      .post<string>("/test", { test: test })
      .pipe(map((data) => data));
  }

  delete(slug: string): Observable<boolean> {
    return this.http.delete<boolean>(`/tests/${slug}`);
  }

  // update(article: Partial<Article>): Observable<Article> {
  //   return this.http
  //     .put<{ article: Article }>(`/articles/${article.slug}`, {
  //       article: article,
  //     })
  //     .pipe(map((data) => data.article));
  // }
}
