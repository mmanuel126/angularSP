import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionMgtService } from '../../services/general/session-mgt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private sessionSrvc: SessionMgtService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isUserLogin = this.sessionSrvc.getSessionVal('isUserLogin');
    if (isUserLogin == 'true') {
      return true;
    } else {
      this.router.navigate([''], {
        queryParams: {
          return: state.url,
        },
      });
      return false;
    }
  }
}
