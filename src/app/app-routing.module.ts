import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { ManagerGuard } from './guards/manager.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-park',
    loadChildren: () => import('./pages/add-park/add-park.module').then( m => m.AddParkPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'user/:id',
    loadChildren: () => import('./pages/user/user.module').then( m => m.UserPageModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'edit-park/:id',
    loadChildren: () => import('./pages/edit-park/edit-park.module').then( m => m.EditParkPageModule),
    canActivate: [AuthGuard, ManagerGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'languages',
    loadChildren: () => import('./pages/languages/languages.module').then( m => m.LanguagesPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'display',
    loadChildren: () => import('./pages/display/display.module').then( m => m.DisplayPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'authorization',
    loadChildren: () => import('./pages/authorization/authorization.module').then( m => m.AuthorizationPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'policy',
    loadChildren: () => import('./pages/policy/policy.module').then( m => m.PolicyPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'credits',
    loadChildren: () => import('./pages/credits/credits.module').then( m => m.CreditsPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'parks',
    loadChildren: () => import('./pages/parks/parks.module').then( m => m.ParksPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'park/:id',
    loadChildren: () => import('./pages/park/park.module').then( m => m.ParkPageModule),
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: 'run',
    loadChildren: () => import('./pages/run/run.module').then( m => m.RunPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: '',
    redirectTo: 'run',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
