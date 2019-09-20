import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { GameService } from './../../../../services/CRUD/LSCHESS/game.service';
import { environment } from 'src/environments/environment';
import { GameStateService } from './../../../../services/CRUD/LSCHESS/gamestate.service';
import { MoveService } from './../../../../services/CRUD/LSCHESS/move.service';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
   imports: [CommonModule,
             GameRoutingModule,
             CKEditorModule,
             FormsModule],
   declarations: [GameComponent],
   providers: [
               NgbModal,
               GameStateService,
               MoveService,
               GameService
               ]
})
export class GameModule {}