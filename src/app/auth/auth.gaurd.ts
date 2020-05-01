import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGaurd implements CanActivate{

  constructor(public authservice: AuthService, public router: Router){}


  canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree>
  {
    const isAuth = this.authservice.getIsAuth();
    if(!isAuth)   //if it is false navigate to the main page
    {
        this.router.navigate(['/login']);
        alert("Please login first");
    }
    return isAuth;
  }

}
