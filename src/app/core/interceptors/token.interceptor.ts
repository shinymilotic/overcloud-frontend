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
  finalize,
  switchMap,
  take,
  throwError,
} from "rxjs";
import { AuthCookieService } from "../services/authcookie.service";
import { UserService } from "../services/user.service";
import { CookieService } from "../services/cookies.service";
import { RefreshTokenState } from "../models/auth/refreshtokenstate";

@Injectable({ providedIn: "root" })
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly jwtService: AuthCookieService,
    private readonly userService: UserService
  ) {}

  private refreshTokenState: number = RefreshTokenState.REFRESHED;
  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const request = this.addTokenHeader(req);

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error.error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (this.refreshTokenState != RefreshTokenState.REFRESHING) {
      this.refreshTokenState = RefreshTokenState.EXPIRED;
    }

    if (this.refreshTokenState != RefreshTokenState.REFRESHING) {
      this.refreshTokenState = RefreshTokenState.REFRESHING;
      console.log("Refreshing Token API: " + request.url);
      this.refreshTokenSubject.next(null);

        return this.userService.refreshToken().pipe(
          switchMap((userId: string) => {
            if (userId != "") {
              this.refreshTokenSubject.next(userId);
              this.userService.setAuth(userId);
            }
            this.refreshTokenState = RefreshTokenState.REFRESHED;
            console.log("Refreshed  API!: " + request.url);

            return next.handle(this.addTokenHeader(request));
          }),
          catchError((err) => {
            this.refreshTokenState = RefreshTokenState.EXPIRED;
            return throwError(() => err);
          }),
          finalize(() => {
            this.refreshTokenState = RefreshTokenState.REFRESHED;
          })
        );
    }

    // while(this.isRefreshing) {
    //   setTimeout(() => {console.log(this.isRefreshing)});
    // }
    return this.refreshTokenSubject
                .pipe(
                    filter(token => token != null)
                    , take(1)
                    , switchMap(token => {
                        return next.handle(this.addTokenHeader(request));
                    })
                );
  }

  private addTokenHeader(request: HttpRequest<any>) {
      return request.clone({
        withCredentials: true
      });
  }
}
