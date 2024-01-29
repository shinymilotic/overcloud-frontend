import { Injectable } from "@angular/core";
import { CookieService } from "./cookies.service";

@Injectable({ providedIn: "root" })
export class JwtService {
  constructor(private readonly cookieService: CookieService) {}

  getRefreshToken(): string {
    return this.cookieService.getCookie("refreshToken");
  }

  getToken(): string {
    return this.cookieService.getCookie("jwtToken");
    // return window.localStorage["jwtToken"];
  }

  saveToken(token: string): void {
    this.cookieService.setCookie("jwtToken", token, 10000000000,"");
    // window.localStorage["jwtToken"] = token;
  }

  destroyToken(): void {
    // window.localStorage.removeItem("jwtToken");
    this.cookieService.deleteCookie("refreshToken");
    this.cookieService.deleteCookie("jwtToken");
  }
}
