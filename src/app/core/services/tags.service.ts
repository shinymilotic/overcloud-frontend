import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { RestResponse } from "../models/restresponse.model";

@Injectable({ providedIn: "root" })
export class TagsService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<string[]> {
    return this.http
      .get<RestResponse<{ tags: string[] }>>("/tags")
      .pipe(map((data) => data.data.tags));
  }
}
