import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})

export class ManagerGuard implements CanActivate {
  
  isManager = false;

  constructor(private router: Router,
    public afAuth: AngularFireAuth,) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
 
    let isManagerAuthenticated = this.isManager;
      
    if (isManagerAuthenticated) {
      return true;
    } else {
      return false;
    }
  }
  
}
