import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
        {
            path: '',
            redirectTo: 'main'
        },
        {
            path: 'main',
            loadChildren: './main/main.module#MainPageModule'
        },
        {
          path: 'blank',
          loadChildren: './blank/blank.module#BlankPageModule'
        },
        {
          path: 'profile',
          loadChildren: './profile/profile.module#ProfilePageModule'
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }