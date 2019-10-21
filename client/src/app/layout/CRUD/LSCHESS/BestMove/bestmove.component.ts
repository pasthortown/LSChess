import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { BestMoveService } from './../../../../services/CRUD/LSCHESS/bestmove.service';
import { BestMove } from './../../../../models/LSCHESS/BestMove';

@Component({
   selector: 'app-bestmove',
   templateUrl: './bestmove.component.html',
   styleUrls: ['./bestmove.component.scss']
})
export class BestMoveComponent implements OnInit {
   best_moves: BestMove[] = [];
   best_moveSelected: BestMove = new BestMove();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private modalService: NgbModal,
               private toastr: ToastrManager,
               private best_moveDataService: BestMoveService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectBestMove(best_move: BestMove) {
      this.best_moveSelected = best_move;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getBestMoves();
   }

   getBestMoves() {
      this.best_moves = [];
      this.best_moveSelected = new BestMove();
      this.best_moveDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.best_moves = r.data as BestMove[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newBestMove(content) {
      this.best_moveSelected = new BestMove();
      this.openDialog(content);
   }

   editBestMove(content) {
      if (typeof this.best_moveSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.openDialog(content);
   }

   deleteBestMove() {
      if (typeof this.best_moveSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.best_moveDataService.delete(this.best_moveSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getBestMoves();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.best_moveDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_BestMoves.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.best_moveDataService.get().then( r => {
         const backupData = r as BestMove[];
         let output = 'id;current_position;response;from;to;is__best\n';
         backupData.forEach(element => {
            output += element.id; + element.current_position + ';' + element.response + ';' + element.from + ';' + element.to + ';' + element.is__best + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_BestMoves.csv');
      }).catch( e => console.log(e) );
   }

   decodeUploadFile(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            const fileBytes = reader.result.toString().split(',')[1];
            const newData = JSON.parse(decodeURIComponent(escape(atob(fileBytes)))) as any[];
            this.best_moveDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   openDialog(content) {
      this.modalService.open(content, { centered: true }).result.then(( response => {
         if ( response === 'Guardar click' ) {
            if (typeof this.best_moveSelected.id === 'undefined') {
               this.best_moveDataService.post(this.best_moveSelected).then( r => {
                  this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
                  this.getBestMoves();
               }).catch( e => console.log(e) );
            } else {
               this.best_moveDataService.put(this.best_moveSelected).then( r => {
                  this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
                  this.getBestMoves();
               }).catch( e => console.log(e) );
            }
         }
      }), ( r => {}));
   }
}