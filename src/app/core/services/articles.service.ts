import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleListConfig } from "../models/blog/article-list-config.model";
import { Article } from "../models/blog/article.model";
import { RestResponse } from "../models/restresponse.model";
import { ArticleList } from "../models/blog/article-list.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  constructor(private readonly http: HttpClient) {}

  query(
    config: ArticleListConfig
  ): Observable<RestResponse<ArticleList>> {
    let params = new HttpParams();

    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });

    return this.http.get<RestResponse<ArticleList>>(
      "/articles",
      { params }
    );
  }

  get(slug: string): Observable<RestResponse<Article>> {
    return this.http
      .get<RestResponse<Article>>(`/articles/${slug}`);
      }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`/articles/${slug}`);
  }

  create(article: Partial<Article>): Observable<RestResponse<Article>> {
    return this.http
      .post<RestResponse<Article>>("/articles", article);
  }

  update(article: Partial<Article>): Observable<RestResponse<Article>> {
    return this.http
      .put<RestResponse<Article>>(`/articles/${article.slug}`, article);
  }

  favorite(slug: string): Observable<RestResponse<Article>> {
    return this.http
      .post<RestResponse<Article>>(`/articles/${slug}/favorite`, {});
  }

  unfavorite(slug: string): Observable<RestResponse<void>> {
    return this.http.delete<RestResponse<void>>(`/articles/${slug}/favorite`);
  }
}
