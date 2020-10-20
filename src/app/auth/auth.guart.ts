import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router'
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad{
  constructor(private authservice: AuthService, private router: Router){ }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(this.authservice.isAuth()){
      return true;
    }else{
      this.router.navigate(['/login']);
    }
  }

  canLoad(route: Route){
    if(this.authservice.isAuth()){
      return true;
    }else{
      this.router.navigate(['/login']);
    }
  }

}
