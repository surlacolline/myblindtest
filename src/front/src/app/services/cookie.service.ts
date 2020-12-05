import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookieService2 {
  constructor(private cookieService: CookieService) { }

  delete(name): void {
    this.cookieService.delete(name);
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
    return cookie;
  }



}
