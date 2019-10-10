import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { GameService } from './../../../../services/CRUD/LSCHESS/game.service';
import { Game } from './../../../../models/LSCHESS/Game';

@Component({
   selector: 'app-game',
   templateUrl: './game.component.html',
   styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
   games: Game[] = [];
   gameSelected: Game = new Game();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private modalService: NgbModal,
               private toastr: ToastrManager,
               private gameDataService: GameService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectGame(game: Game) {
      this.gameSelected = game;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getGames();
   }

   getGames() {
      this.games = [];
      this.gameSelected = new Game();
      this.gameDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.games = r.data as Game[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newGame(content) {
      this.gameSelected = new Game();
      this.openDialog(content);
   }

   editGame(content) {
      if (typeof this.gameSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.openDialog(content);
   }

   deleteGame() {
      if (typeof this.gameSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.gameDataService.delete(this.gameSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getGames();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.gameDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Games.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.gameDataService.get().then( r => {
         const backupData = r as Game[];
         let output = 'id;id_player_white;id_player_black;start_time;end_time;start_fen;pgn\n';
         backupData.forEach(element => {
            output += element.id; + element.id_player_white + ';' + element.id_player_black + ';' + element.start_time + ';' + element.end_time + ';' + element.start_fen + ';' + element.pgn + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Games.csv');
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
            this.gameDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   openDialog(content) {
      this.modalService.open(content, { centered: true , size: 'lg' }).result.then(( response => {
         if ( response === 'Guardar click' ) {
            if (typeof this.gameSelected.id === 'undefined') {
               this.gameDataService.post(this.gameSelected).then( r => {
                  this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
                  this.getGames();
               }).catch( e => console.log(e) );
            } else {
               this.gameDataService.put(this.gameSelected).then( r => {
                  this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
                  this.getGames();
               }).catch( e => console.log(e) );
            }
         }
      }), ( r => {}));
   }
}