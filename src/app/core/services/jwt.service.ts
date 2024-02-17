import { Injectable } from "@angular/core";
import { CookieService } from "./cookies.service";

@Injectable({ providedIn: "root" })
export class JwtService {
  constructor(private readonly cookieService: CookieService) {}



  getUserId(): string {
    return this.cookieService.getCookie("userId");
  }

  saveToken(userId: string): void {
    this.cookieService.setCookie("userId", userId, 10000000000,"");
  }

  destroyToken(): void {
    this.cookieService.deleteCookie("userId");
  }
}
