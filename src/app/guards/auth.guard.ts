import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  isLoggedIn = false;

  constructor(private router: Router,
    public afAuth: AngularFireAuth,) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
 
    let userAuthenticated = this.isLoggedIn;
      
    if (userAuthenticated) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
  
}
