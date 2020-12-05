import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieService2 {
  browserCookie;
  constructor(private cookieService: CookieService) { }

  delete(name): void {
    this.cookieService.delete(name);
  }

  getCookie(name): any {
    if (document.cookie.length === 0) {
      return null;
    }

    const regSepCookie = new RegExp('(; )', 'g');
    const cookies = document.cookie.split(regSepCookie);

    for (let i = 0; i < cookies.length; i++) {
      const regInfo = new RegExp('=', 'g');
      const infos = cookies[i].split(regInfo);
      if (infos[0] == name) {
        return unescape(infos[1]);
      }
    }
    return null;
  }

  setCookie(name: string, value: string, expire?: number): void {
    if (!expire) {
      document.cookie = `${name}=${value}`;
    } else {
      this.cookieService.set(name, value, undefined, undefined, undefined, undefined, 'Lax');
    }
  }

  get(name: string): string {
    const cookie = this.cookieService.get(name);
    return JSON.parse(cookie.replace(/(?:(?:^|.*;\s*)value\s*\=\s*([^;]*).*$)|^.*$/, '$1'));
  }


  get2(name: string): string {
    const cookie = this.cookieService.get(name);
    return cookie;
  }

  set(name: string, value: string, expire?: number): void {
    if (expire) {
      this.cookieService.set(name, value, expire, undefined, undefined, undefined, 'Lax');
    } else {
      this.cookieService.set(name, value, undefined, undefined, undefined, undefined, 'Lax');
    }

  }

  /**
 * Loads the browser's cookie into {@code browserCookie}
 */
  loadBrowserCookie() {
    try {
      this.browserCookie = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)value\s*\=\s*([^;]*).*$)|^.*$/, '$1'));
    } catch (e) {
      document.cookie = 'value=;';
      this.browserCookie = {};
      console.error('Cookie was corrupted!');
    }
  }
  /**
   * Saves the browser cookie
   */
  flushBrowserCookie() {
    document.cookie = 'value=' + JSON.stringify(this.browserCookie);
  }




}
