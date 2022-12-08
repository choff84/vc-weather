import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
<<<<<<< HEAD
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
=======
    path: 'home',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule)
  },
  {
    path: 'ef5weather',
    loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule)
>>>>>>> 33d5c491ebaa0c16a66042256306b96560ce56a4
  },
  {
    path: '',
    redirectTo: '/home',
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
