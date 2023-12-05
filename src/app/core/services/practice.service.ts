import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Profile } from "../models/profile.model";
import { HttpClient } from "@angular/common/http";
import { Practice } from "../models/practice.model";

@Injectable({ providedIn: "root" })
export class PracticeService {
  constructor(private readonly http: HttpClient) {}

  createPractice(practice: Practice): Observable<void> {
    return this.http.post<void>(`/practice`, { practice: practice });
  }
}
