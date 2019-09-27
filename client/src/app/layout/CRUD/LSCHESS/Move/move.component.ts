import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { MoveService } from './../../../../services/CRUD/LSCHESS/move.service';
import { Move } from './../../../../models/LSCHESS/Move';

@Component({
   selector: 'app-move',
   templateUrl: './move.component.html',
   styleUrls: ['./move.component.scss']
})
export class MoveComponent implements OnInit {
   moves: Move[] = [];
   moveSelected: Move = new Move();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private modalService: NgbModal,
               private toastr: ToastrManager,
               private moveDataService: MoveService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectMove(move: Move) {
      this.moveSelected = move;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getMoves();
   }

   getMoves() {
      this.moves = [];
      this.moveSelected = new Move();
      this.moveDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.moves = r.data as Move[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newMove(content) {
      this.moveSelected = new Move();
      this.openDialog(content);
   }

   editMove(content) {
      if (typeof this.moveSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.openDialog(content);
   }

   deleteMove() {
      if (typeof this.moveSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.moveDataService.delete(this.moveSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getMoves();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.moveDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Moves.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.moveDataService.get().then( r => {
         const backupData = r as Move[];
         let output = 'id;from;to;moment;pgn\n';
         backupData.forEach(element => {
            output += element.id; + element.from + ';' + element.to + ';' + element.moment + ';' + element.pgn + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Moves.csv');
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
            this.moveDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   openDialog(content) {
      this.modalService.open(content, { centered: true , size: 'lg' }).result.then(( response => {
         if ( response === 'Guardar click' ) {
            if (typeof this.moveSelected.id === 'undefined') {
               this.moveDataService.post(this.moveSelected).then( r => {
                  this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
                  this.getMoves();
               }).catch( e => console.log(e) );
            } else {
               this.moveDataService.put(this.moveSelected).then( r => {
                  this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
                  this.getMoves();
               }).catch( e => console.log(e) );
            }
         }
      }), ( r => {}));
   }
}