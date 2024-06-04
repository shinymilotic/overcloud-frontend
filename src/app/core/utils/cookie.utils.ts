import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CookieUtils {
  constructor() {}

  public getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(";");
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, "");
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return "";
  }

  public deleteCookie(name: string) {
    this.setCookie(name, "", -1);
  }

  public setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = ""
  ) {
    let expireDaysObject: Date = new Date();
    expireDaysObject.setTime(
      expireDaysObject.getTime() + expireDays * 24 * 60 * 60 * 1000
    );
    let expires: string = "expires=" + expireDaysObject.toUTCString();
    document.cookie =
      name +
      "=" +
      value +
      "; " +
      expires +
      (path.length > 0 ? "; path=" + path : "");
  }
}
