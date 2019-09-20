import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameStateRoutingModule } from './gamestate-routing.module';
import { GameStateComponent } from './gamestate.component';
import { GameStateService } from './../../../../services/CRUD/LSCHESS/gamestate.service';
import { environment } from 'src/environments/environment';

@NgModule({
   imports: [CommonModule,
             GameStateRoutingModule,
             FormsModule],
   declarations: [GameStateComponent],
   providers: [
               NgbModal,
               GameStateService
               ]
})
export class GameStateModule {}