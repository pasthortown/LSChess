import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MoveRoutingModule } from './move-routing.module';
import { MoveComponent } from './move.component';
import { MoveService } from './../../../../services/CRUD/LSCHESS/move.service';
import { environment } from 'src/environments/environment';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
   imports: [CommonModule,
             MoveRoutingModule,
             CKEditorModule,
             FormsModule],
   declarations: [MoveComponent],
   providers: [
               NgbModal,
               MoveService
               ]
})
export class MoveModule {}