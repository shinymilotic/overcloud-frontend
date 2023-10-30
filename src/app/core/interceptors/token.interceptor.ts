import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  shareReplay,
  switchMap,
  take,
  tap,
  throwError,
} from "rxjs";
import { JwtService } from "../services/jwt.service";
import { UserService } from "../services/user.service";
import { CookieService } from "../services/cookies.service";
import { Auth } from "../models/auth.model";

@Injectable({ providedIn: "root" })
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly cookieService: CookieService
  ) {}

  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.jwtService.getToken();
    const request = this.addTokenHeader(req, token);
    console.log("TokenInterceptor");
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(error.error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    while (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.jwtService.getRefreshToken();

      if (token) {
        this.userService.purgeAuth();
        return this.userService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = true;
            this.jwtService.saveToken(token.accessToken);
            this.cookieService.setCookie(
              "refreshToken",
              token.refreshToken,
              1000,
              ""
            );
            this.refreshTokenSubject.next(token.accessToken);
            this.userService
              .auth(token.accessToken, token.refreshToken)
              .subscribe();
            this.isRefreshing = false;
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            return throwError(err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        ...(token ? { Authorization: `${token}` } : {}),
      },
    });
  }
}
