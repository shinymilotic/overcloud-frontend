import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Profile } from "../models/auth/profile.model";
import { HttpClient } from "@angular/common/http";
import { RestResponse } from "../models/restresponse.model";

@Injectable({ providedIn: "root" })
export class ProfileService {
  constructor(private readonly http: HttpClient) {}

  get(username: string): Observable<Profile> {
    return this.http.get<RestResponse<Profile>>("/profiles/" + username).pipe(
      map((data) => data.data),
      shareReplay(1)
    );
  }

  follow(username: string): Observable<Profile> {
    return this.http
      .post<{ profile: Profile }>("/profiles/" + username + "/follow", {})
      .pipe(map((data: { profile: Profile }) => data.profile));
  }

  unfollow(username: string): Observable<Profile> {
    return this.http
      .delete<{ profile: Profile }>("/profiles/" + username + "/follow")
      .pipe(map((data: { profile: Profile }) => data.profile));
  }
}
