import { Injectable, signal } from "@angular/core";
import { Observable, BehaviorSubject, pipe } from "rxjs";

import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/auth/user.model";
import { Router } from "@angular/router";
import { AuthCookieUtils } from "../utils/authCookie.utils";

@Injectable({ providedIn: "root" })
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  public userSignal = signal<User | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly authCookieUtils: AuthCookieUtils,
  ) {}

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http
      .post<User>("/users/login", { user: credentials })
      .pipe(tap((user) => {
        this.currentUserSubject.next(user);
        this.userSignal.set(user);
        this.authCookieUtils.saveUserIdCookie(user.id);
      }));
  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<User> {
    return this.http
      .post<User>("/users", { user: credentials })
      .pipe(tap((user) => {
        // this.currentUserSubject.next(user);
        // this.setAuth(user.id);
      }));
  }

  logout(): Observable<boolean> {
    return this.http.post<boolean>("/users/logout", {});
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>("/users");
    // .pipe(
    //   tap({
    //     next: ({ user }) => {console.log("getCurrentUser")},
    //     error: () => this.purgeAuth(),
    //   }),
    //   shareReplay(1)
    // );
  }

  update(user: Partial<User>): Observable<User> {
    return this.http.put<User>("/users", user).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  auth(): Observable<User> {
    return this.http.get<User>("/users").pipe(
      tap({
        next: (user) => {
          this.currentUserSubject.next(user);
          // this.setAuth(accessToken, refreshToken);
        },
        // error: () => this.purgeAuth(),
      }),
      shareReplay(1)
    );
  }

  purgeAuth(): void {
    this.authCookieUtils.destroyUserIdCookie();
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<string> {
    return this.http
      .post<{userId: string}>("/users/refreshToken", {})
      .pipe(map((data) => data.userId));
      ;
  }

  confirmEmail(token: string) : Observable<boolean> {
    return this.http
      .post<boolean>(`/confirmEmail`, {"confirmToken" : token});
    ;
  }

  getFollowers(userId: string) : Observable<User[]> {
    return this.http
      .get<User[]>(`/followers/${userId}`, {})
      .pipe(map((data: any) => data.followers));
    ;
  }
}
