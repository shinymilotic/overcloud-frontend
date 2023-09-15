import { Injectable } from "@angular/core";
import { CookieService } from "./cookies.service";

@Injectable({ providedIn: "root" })
export class JwtService {
  constructor(private readonly cookieService: CookieService) {}

  getRefreshToken(): string {
    return this.cookieService.getCookie("refreshToken");
  }

  getToken(): string {
    return window.localStorage["jwtToken"];
  }

  saveToken(token: string): void {
    window.localStorage["jwtToken"] = token;
  }

  destroyToken(): void {
    window.localStorage.removeItem("jwtToken");
    this.cookieService.deleteCookie("refreshToken");
  }
}
