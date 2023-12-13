import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Profile } from "../models/auth/profile.model";
import { HttpClient } from "@angular/common/http";
import { Practice } from "../models/test/practice.model";
import { UserPractice } from "../models/test/user-practices.model";

@Injectable({ providedIn: "root" })
export class PracticeService {
  constructor(private readonly http: HttpClient) {}

  createPractice(practice: Practice): Observable<void> {
    return this.http.post<void>(`/practice`, { practice: practice });
  }

  getPractices(username: string): Observable<UserPractice[]> {
    return this.http
      .get<{ practices: UserPractice[] }>(`/practices/${username}`)
      .pipe(map((data: { practices: UserPractice[] }) => data.practices));
  }
}
