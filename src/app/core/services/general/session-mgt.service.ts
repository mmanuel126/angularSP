import { Injectable } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class SessionMgtService {

  constructor(public session: SessionStorageService) { }

  setSessionVar(key: string, val: string) {
    this.session.set(key, val, 0, 'y');
  }

  getSessionVal(key: string) {
    return this.session.get(key);
  }

  removeSessionVal(key: string) {
    return this.session.remove(key);
  }

  clearSessionVal() {
    return this.session.clear();
  }

}
