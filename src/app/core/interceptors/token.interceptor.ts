import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
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
import { UserService } from "../services/user.service";
import { AuthCookieUtils } from "../utils/authCookie.utils";

@Injectable({ providedIn: "root" })
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly userService: UserService,
    private readonly authCookieUtils: AuthCookieUtils
  ) {}

  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

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
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      console.log("Refreshing Token API: " + request.url);
      this.refreshTokenSubject.next(null);

      return this.userService.refreshToken().pipe(
        switchMap((userId: string) => {
          if (userId != "") {
            this.refreshTokenSubject.next(userId);
            this.authCookieUtils.saveUserIdCookie(userId);
          }
          return next.handle(this.addTokenHeader(request));
        }),
        catchError((err) => {
          return throwError(() => err);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((token: string | null) => token != null),
      take(1),
      switchMap((token: string | null) => {
        return next.handle(this.addTokenHeader(request));
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>) {
    return request.clone({
      withCredentials: true,
    });
  }
}
