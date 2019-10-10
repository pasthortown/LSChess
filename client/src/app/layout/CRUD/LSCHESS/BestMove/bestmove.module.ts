import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BestMoveRoutingModule } from './bestmove-routing.module';
import { BestMoveComponent } from './bestmove.component';
import { BestMoveService } from './../../../../services/CRUD/LSCHESS/bestmove.service';
import { environment } from 'src/environments/environment';

@NgModule({
   imports: [CommonModule,
             BestMoveRoutingModule,
             FormsModule],
   declarations: [BestMoveComponent],
   providers: [
               NgbModal,
               BestMoveService
               ]
})
export class BestMoveModule {}