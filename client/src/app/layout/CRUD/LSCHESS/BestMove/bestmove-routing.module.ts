import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BestMoveComponent } from './bestmove.component';

const routes: Routes = [
   {
      path: '',
      component: BestMoveComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class BestMoveRoutingModule {}
