import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor() {}

  getCookie(name): string {
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
}
