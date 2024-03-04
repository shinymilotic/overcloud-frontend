import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Profile } from "../models/auth/profile.model";
import { HttpClient } from "@angular/common/http";
import { Practice } from "../models/test/practice.model";
import { UserPractice } from "../models/test/user-practices.model";
import { PracticeResult } from "src/app/features/profile/practice-result/PracticeResult";

@Injectable({ providedIn: "root" })
export class PracticeService {
  constructor(private readonly http: HttpClient) {}

  createPractice(practice: Practice): Observable<{practiceId: string}> {
    return this.http
      .post<{practiceId: string}>(`/practice`, { practice: practice });
  }

  getPractices(username: string): Observable<UserPractice[]> {
    return this.http
      .get<{ practices: UserPractice[] }>(`/practices/${username}`)
      .pipe(map((data: { practices: UserPractice[] }) => data.practices));
  }

  getPractice(id: string): Observable<PracticeResult> {
    return this.http
      .get<PracticeResult>(`/practice/${id}`);
  }
}
