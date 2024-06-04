import { Injectable } from "@angular/core";
import { CookieUtils } from "./cookie.utils";

@Injectable({ providedIn: "root" })
export class AuthCookieUtils {
  constructor(private readonly cookieUtils: CookieUtils) {}

  getUserId(): string {
    return this.cookieUtils.getCookie("userId");
  }

  saveUserIdCookie(userId: string): void {
    this.cookieUtils.setCookie("userId", userId, 10000000000,"");
  }

  destroyUserIdCookie(): void {
    this.cookieUtils.deleteCookie("userId");
  }
}
