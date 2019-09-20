import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { GameStateService } from './../../../../services/CRUD/LSCHESS/gamestate.service';
import { GameState } from './../../../../models/LSCHESS/GameState';

@Component({
   selector: 'app-gamestate',
   templateUrl: './gamestate.component.html',
   styleUrls: ['./gamestate.component.scss']
})
export class GameStateComponent implements OnInit {
   game_states: GameState[] = [];
   game_stateSelected: GameState = new GameState();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private modalService: NgbModal,
               private toastr: ToastrManager,
               private game_stateDataService: GameStateService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectGameState(game_state: GameState) {
      this.game_stateSelected = game_state;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getGameStates();
   }

   getGameStates() {
      this.game_states = [];
      this.game_stateSelected = new GameState();
      this.game_stateDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.game_states = r.data as GameState[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newGameState(content) {
      this.game_stateSelected = new GameState();
      this.openDialog(content);
   }

   editGameState(content) {
      if (typeof this.game_stateSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.openDialog(content);
   }

   deleteGameState() {
      if (typeof this.game_stateSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.game_stateDataService.delete(this.game_stateSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getGameStates();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.game_stateDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_GameStates.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.game_stateDataService.get().then( r => {
         const backupData = r as GameState[];
         let output = 'id;description\n';
         backupData.forEach(element => {
            output += element.id; + element.description + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_GameStates.csv');
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
            this.game_stateDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   openDialog(content) {
      this.modalService.open(content, { centered: true }).result.then(( response => {
         if ( response === 'Guardar click' ) {
            if (typeof this.game_stateSelected.id === 'undefined') {
               this.game_stateDataService.post(this.game_stateSelected).then( r => {
                  this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
                  this.getGameStates();
               }).catch( e => console.log(e) );
            } else {
               this.game_stateDataService.put(this.game_stateSelected).then( r => {
                  this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
                  this.getGameStates();
               }).catch( e => console.log(e) );
            }
         }
      }), ( r => {}));
   }
}