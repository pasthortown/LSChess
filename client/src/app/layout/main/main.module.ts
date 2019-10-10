import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { BestMoveService } from 'src/app/services/CRUD/LSCHESS/bestmove.service';

@NgModule({
    imports: [CommonModule, MainRoutingModule],
    declarations: [MainComponent],
    providers: [BestMoveService]
})
export class MainModule {}
