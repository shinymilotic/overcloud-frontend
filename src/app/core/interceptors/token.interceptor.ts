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
  switchMap,
  take,
  throwError,
} from "rxjs";
import { JwtService } from "../services/jwt.service";
import { UserService } from "../services/user.service";
import { CookieService } from "../services/cookies.service";

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
    console.log("Refreshing: " + request.url)
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

        this.userService.purgeAuth();
        this.jwtService.destroyToken();
        return this.userService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.accessToken);
            return next.handle(this.addTokenHeader(request, false));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            return throwError(() => err);
          })
        );
    }


    return next.handle(this.addTokenHeader(request));
  }

  private addTokenHeader(request: HttpRequest<any>, isCredentials: boolean = true) {
    
    if (isCredentials) {
      return request.clone({
        withCredentials: true
      });
    } else {
      return request.clone();
    }
      
    // }
  }
}
