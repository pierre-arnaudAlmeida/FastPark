import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'add-park',
    loadChildren: () => import('./pages/add-park/add-park.module').then( m => m.AddParkPageModule)
  },
  {
    path: 'edit-park/:id',
    loadChildren: () => import('./pages/edit-park/edit-park.module').then( m => m.EditParkPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'languages',
    loadChildren: () => import('./pages/languages/languages.module').then( m => m.LanguagesPageModule)
  },
  {
    path: 'display',
    loadChildren: () => import('./pages/display/display.module').then( m => m.DisplayPageModule)
  },
  {
    path: 'authorization',
    loadChildren: () => import('./pages/authorization/authorization.module').then( m => m.AuthorizationPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'policy',
    loadChildren: () => import('./pages/policy/policy.module').then( m => m.PolicyPageModule)
  },
  {
    path: 'credits',
    loadChildren: () => import('./pages/credits/credits.module').then( m => m.CreditsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
