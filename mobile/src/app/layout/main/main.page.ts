import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/negocio/board';
import * as Chess from 'chess.js';
import { Move } from 'src/app/models/LSCHESS/Move';
import Swal from 'sweetalert2'
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerButton } from '@ionic/core';
import { saveAs } from 'file-saver/FileSaver';
import { Cycle } from 'src/app/models/negocio/cycle';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  appName = environment.app_name;
  chess: Chess = new Chess();
  board: Board;
  player_white = 'Blancas';
  player_black = 'Negras';
  newMove: Move = new Move();
  cordsX = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  cordsXI = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
  cordsY = ['8', '7', '6', '5', '4', '3', '2', '1'];
  tiempoNegras = '10:00';
  tiempoBlancas = '10:00';
  current_position = '';
  timeNegras = 600;
  timeBlancas = 600;
  time_running = false;
  user = '';
  current_move = 0;
  checking_move = 0;

  constructor(private pickerCtrl: PickerController) { 
    this.board = new Board(this.chess.fen().split(' ')[0],5);
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  cargarPartida(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        const datosBLOB = reader.result.toString().split(',')[1];
        const datos = JSON.parse(decodeURIComponent(escape(atob(datosBLOB))));
        this.player_black = datos.player_black;
        this.player_white = datos.player_white;
        this.timeBlancas = datos.time_white;
        this.timeNegras = datos.time_black;
        this.load_PGN(datos.pgn);
      };
    }
  }

  load_PGN(pgn: string) {
    this.chess.load_pgn(pgn);
    this.refresh_board();
    this.refreshClock();
  }

  PGN2Cycles(pgn: string) {
    const pgn_cycles = pgn.split('\n');
    const cycles: Cycle[] = [];
    pgn_cycles.forEach(line => {
      const newCycle = new Cycle();
      newCycle.id = parseInt(line.split('.')[0]);
      newCycle.white_move = line.split('.')[1].split(' ')[1];
      newCycle.black_move = line.split('.')[1].split(' ')[2];
      cycles.push(newCycle);
    });
    return cycles;
  }

  Cycles2PGN(cycles: Cycle[], moves?: number) {
    let pgn = '';
    let recrated_moves = 0;
    cycles.forEach(cycle => {
      if (typeof(moves) !== 'undefined') {
        if (recrated_moves < moves) {
          pgn += cycle.id + '. ' + cycle.white_move;
          recrated_moves++;
        }
        if (recrated_moves < moves) {
          if (typeof(cycle.black_move) !== 'undefined') {
            pgn += ' ' + cycle.black_move;
            recrated_moves++;
          }
        }
        pgn += '\n';
      } else {
        pgn += cycle.id + '. ' + cycle.white_move;
        if (typeof(cycle.black_move) !== 'undefined') {
          pgn += ' ' + cycle.black_move;
        }
        pgn += '\n';
      }
    });
    return pgn;
  }

  preview_move() {
    const cycles: Cycle[] = this.PGN2Cycles(this.current_position);
    this.checking_move = this.checking_move - 1;
    const pgn = this.Cycles2PGN(cycles, this.checking_move);
    this.chess.load_pgn(pgn);
    this.board.newPosition(this.chess.fen().split(' ')[0]);
    if (this.chess.in_check()) {
      this.board.check(this.get_turn());
    }
  }

  next_move() {
    const cycles: Cycle[] = this.PGN2Cycles(this.current_position);
    this.checking_move = this.checking_move + 1;
    const pgn = this.Cycles2PGN(cycles, this.checking_move);
    this.chess.load_pgn(pgn);
    this.board.newPosition(this.chess.fen().split(' ')[0]);
    if (this.chess.in_check()) {
      this.board.check(this.get_turn());
    }
  }

  rotate_board() {
    this.board.rotate_board();
  }

  save_pgn() {
    const backupData = {pgn: this.chess.pgn(),
                        player_white: this.player_white,
                        player_black: this.player_black,
                        time_white: this.timeBlancas,
                        time_black: this.timeNegras,                        
                      };
    const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain' });
    const fecha = new Date();
    saveAs(blob, fecha.toLocaleDateString() + '_chess.json');
  }

  setTimeBlancas() {
    Swal.fire({
      title: 'Tiempo Blancas (segundos)',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Establecer',
    }).then((result) => {
      if (result.value > 0) {
        this.timeBlancas = result.value;
        this.refreshClock();
      } 
    });
  }

  reloj() {
    if (this.chess.game_over()) {
      this.time_running = false;
      return;
    }
    if (this.get_turn() == 'white') {
      if (this.current_move == this.checking_move) {
        this.timeBlancas = this.timeBlancas - 1;
      }
      this.refreshClock() 
    } else {
      if (this.current_move == this.checking_move) { 
        this.timeNegras = this.timeNegras - 1;
      }
      this.refreshClock()
    }
    if (this.time_running) {
      setTimeout(() => {
        this.reloj();
      }, 1000);
    }
  }

  setTimeNegras() {
    Swal.fire({
      title: 'Tiempo Negras (segundos)',
      input: 'number',
      showCancelButton: true,
      confirmButtonText: 'Establecer',
    }).then((result) => {
      if (result.value > 0) {
        this.timeNegras = result.value;
        this.refreshClock();
      } 
    });
  }

  clockText(seconds_to_set: number) {
    const seconds = Math.round(seconds_to_set);
    let minutos = 0;
    let segundos = 0;
    if (seconds > 60) {
      minutos = Math.floor(seconds/60);
      segundos = seconds - (Math.floor(seconds/60)*60);
    } else {
      segundos = seconds;
    }
    let minutosText = minutos.toString();
    let segundosText = segundos.toString();
    if (minutos < 10) {
      minutosText = '0' + minutosText;
    }
    if (segundos < 10) {
      segundosText = '0' + segundosText;
    }
    return minutosText  + ':' + segundosText;
  }

  refreshClock() {
    this.tiempoBlancas = this.clockText(this.timeBlancas);
    this.tiempoNegras = this.clockText(this.timeNegras);
    if (this.timeBlancas == 0) {
      this.time_running = false;
      Swal.fire({
        title: 'Fin del Tiempo',
        text: 'Pierden las Blancas',
        type: 'success',
        confirmButtonText: 'Aceptar'
      });
    }
    if (this.timeNegras == 0) {
      this.time_running = false;
      Swal.fire({
        title: 'Fin del Tiempo',
        text: 'Pierden las Negras',
        type: 'success',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  new_game() {
    this.chess.reset();
    this.refresh_board();
  }

  async showPropotionMenu(from: string, to: string) {
    let opts: PickerOptions = {
      buttons: [
        {
          text: 'Seleccionar',
          cssClass: 'special-done'
        }
      ],
      columns: [
        {
          name: 'piece',
          options: [
            { text: 'Torre', value: 'r' },
            { text: 'Caballo', value: 'n' },
            { text: 'Alfil', value: 'b' },
            { text: 'Dama', value: 'q' }
          ]
        }
      ]
    };
    let picker = await this.pickerCtrl.create(opts);
    picker.present();
    picker.onDidDismiss().then(async data => {
      const piece = await picker.getColumn('piece');
      this.chess.move({ from: from, to: to, promotion: piece.options[piece.selectedIndex].value});
      this.newMove = new Move();
      this.refresh_board();
    });
  }

  play_pc() {
    const gameOver = this.chess.game_over();
    if (!gameOver) {
      let possibleMoves = this.get_possible_moves();
      let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      this.chess.move(move);
      this.refresh_board();
    }
  }

  refresh_board() {
    this.board.newPosition(this.chess.fen().split(' ')[0]);
    this.current_position = this.chess.pgn({ max_width: 5, newline_char: '\n' });
    this.check_specials();
  }

  move(row_selected: number, column_selected: number) {
    let row = 0;
    let column = 0;
    if(this.board.white_side) {
      row = row_selected;
      column = column_selected;
    } else {
      row = 7-row_selected;
      column = 7-column_selected;
    }
    if (this.current_move !== this.checking_move) {
      return;
    }
    if (this.chess.game_over() || this.timeBlancas == 0 || this.timeNegras == 0) {
      this.time_running = false;
      return;
    }
    if (!this.time_running) {
      this.time_running = true;
      this.reloj();
    }
    const square_piece = this.get_square_piece(row,column); 
    if (square_piece.piece == '' && this.newMove.from == '') {
      return;
    }
    if (this.get_turn() !== square_piece.color && this.newMove.from == '') {
      return;
    }
    if (this.newMove.from == '' || this.get_turn() == square_piece.color) {
      const piece_square = this.get_square_piece(row, column);
      this.newMove.from = this.cordsX[column] + this.cordsY[row];  
      this.newMove.piece_moving = piece_square.piece;
      this.newMove.piece_moving_color = piece_square.color;
      this.board.drawPossibleMoves(this.get_possible_moves(this.newMove.from), square_piece.piece);
    } else {
      this.newMove.to = this.cordsX[column] + this.cordsY[row];
      const possibleMoves = this.get_possible_moves(this.newMove.from);
      let continueMoving = false;
      possibleMoves.forEach(possibleMove => {
        if (possibleMove.to == this.newMove.to) {
          continueMoving = true;
        }
      });
      if (!continueMoving) {
        this.refresh_board();
        this.newMove = new Move();
        this.current_move++;
        this.checking_move = this.current_move;
        return;
      }
      if (( row == 0 || row == 7 ) && this.newMove.piece_moving == 'p') {
        this.showPropotionMenu(this.newMove.from, this.newMove.to);
      } else {
        this.chess.move({ from: this.newMove.from, to: this.newMove.to });
        this.refresh_board();
        this.newMove = new Move();
        this.current_move++;
        this.checking_move = this.current_move;
      }
    }
  }

  get_possible_moves(square?: string) {
    if (typeof(square) == 'undefined') {
      return this.chess.moves();
    } else {
      return this.chess.moves({square: square, verbose: true});
    }
  }

  get_square_piece(row: number, column: number) {
    const piece: string = this.board.position[row][column];
    let color = '';
    if (piece == '') {
      return {piece: '', color: ''};
    }
    if (piece.toLowerCase() == piece) {
      color = 'black';
    } else {
      color = 'white';
    }
    return {piece: piece.toLowerCase(), color: color};
  }

  get_turn() {
    let turn = {w: 'white', b: 'black'};
    return turn[this.chess.turn()];
  }
  
  get_PGN() {
    return this.chess.pgn({ max_width: 5, newline_char: '<br />' });
  }

  check_specials() {
    let turno = 'Negras';
    if (this.get_turn() == 'white') {
      turno = 'Blancas';
    }
    if (this.chess.in_check()) {
      this.board.check(this.get_turn());
    }
    if (this.chess.in_checkmate()) {
      Swal.fire({
        title: 'Jaque Mate!',
        text: 'Pierden las ' + turno,
        type: 'success',
        confirmButtonText: 'Aceptar'
      });
    }
    if (this.chess.in_draw()) {
      if (this.chess.in_stalemate()) {
        Swal.fire({
          title: 'Tablas!',
          text: 'Ahogado, no es posible hacer más movimientos.',
          type: 'success',
          confirmButtonText: 'Aceptar'
        }).then(r => {
          this.new_game();
        });
      }
      if (this.chess.in_threefold_repetition()) {
        Swal.fire({
          title: 'Tablas!',
          text: 'Repetición.',
          type: 'success',
          confirmButtonText: 'Aceptar'
        }).then(r => {
          this.new_game();
        });
      }
      if (this.chess.insufficient_material()) {
        Swal.fire({
          title: 'Tablas!',
          text: 'Material insuficiente.',
          type: 'success',
          confirmButtonText: 'Aceptar'
        }).then(r => {
          this.new_game();
        });
      }
    }
  }

  set_position(position: string) {
    const newPosition = '4r3/8/2p2PPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 w - - 1 45';
    this.chess.load(newPosition);
    this.refresh_board();
  }

  undo_move() {
    this.chess.undo();
    this.refresh_board();
  }
}
