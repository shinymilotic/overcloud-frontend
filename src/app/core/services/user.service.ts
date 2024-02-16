import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, pipe } from "rxjs";

import { JwtService } from "./jwt.service";
import { map, distinctUntilChanged, tap, shareReplay } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/auth/user.model";
import { Router } from "@angular/router";
import { CookieService } from "./cookies.service";
import { RefreshTokenResponse } from "../models/auth/refreshtoken.model";
import { Auth } from "../models/auth/auth.model";

@Injectable({ providedIn: "root" })
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router,
    private readonly cookieService: CookieService
  ) {}

  login(credentials: { email: string; password: string }): Observable<Auth> {
    return this.http
      .post<Auth>("/users/login", { user: credentials })
      .pipe(tap((user) => {
        this.currentUserSubject.next(user);
        this.setAuth(user.accessToken, user.refreshToken)
      }));
  }

  register(credentials: {
    username: string;
    email: string;
    password: string;
  }): Observable<Auth> {
    return this.http
      .post<Auth>("/users", { user: credentials })
      .pipe(tap((user) => {
        this.currentUserSubject.next(user);
        this.setAuth(user.accessToken, user.refreshToken)
      }));
  }

  logout(): Observable<boolean> {
    const token = this.jwtService.getRefreshToken();
    return this.http.post<boolean>("/users/logout", token);
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

  auth(accessToken: string, refreshToken: string): Observable<User> {
    return this.http.get<User>("/users").pipe(
      tap({
        next: (user) => {
          this.currentUserSubject.next(user);
          // this.setAuth(accessToken, refreshToken);
        },
        error: () => this.purgeAuth(),
      }),
      shareReplay(1)
    );
  }

  setAuth(accessToken: string, refreshToken: string): void {
    this.jwtService.saveToken(accessToken);
    this.cookieService.setCookie("refreshToken", refreshToken, 1000, "");
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }

  refreshToken(
    refreshToken: string
  ): Observable<{ response: RefreshTokenResponse }> {
    return this.http
      .post<{ response: RefreshTokenResponse }>("/users/refreshToken", {
        refreshToken,
      })
      .pipe(tap(({ response }) => {}));
  }
}
