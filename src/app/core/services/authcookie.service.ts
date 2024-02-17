import { Injectable } from "@angular/core";
import { CookieService } from "./cookies.service";

@Injectable({ providedIn: "root" })
export class AuthCookieService {
  constructor(private readonly cookieService: CookieService) {}

  getUserId(): string {
    return this.cookieService.getCookie("userId");
  }

  saveUserIdCookie(userId: string): void {
    this.cookieService.setCookie("userId", userId, 10000000000,"");
  }

  destroyUserIdCookie(): void {
    this.cookieService.deleteCookie("userId");
  }
}
