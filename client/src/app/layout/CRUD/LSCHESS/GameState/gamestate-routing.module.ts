import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameStateComponent } from './gamestate.component';

const routes: Routes = [
   {
      path: '',
      component: GameStateComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class GameStateRoutingModule {}
