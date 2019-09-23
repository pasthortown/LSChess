import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/negocio/board';
import * as Chess from 'chess.js';
import { Move } from 'src/app/models/LSCHESS/Move';
import Swal from 'sweetalert2'
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerButton } from '@ionic/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  appName = environment.app_name;
  chess: Chess = new Chess();
  board: Board;
  newMove: Move = new Move();
  cordsX = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  cordsY = ['8', '7', '6', '5', '4', '3', '2', '1'];

  constructor(private pickerCtrl: PickerController) { 
    this.board = new Board(this.chess.fen().split(' ')[0],5);
  }

  ngOnInit() {
    
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
    this.check_specials();
  }

  move(row: number, column: number) {
    if(this.chess.game_over()) {
      return;
    }
    const square_piece = this.get_square_piece(row,column); 
    if (square_piece.piece == '' && this.newMove.from == '') {
      return;
    }
    if (this.get_turn() !== square_piece.color && this.newMove.from == '') {
      return;
    }
    if (this.newMove.from == '' || this.get_turn() == square_piece.color) {
      this.newMove.from = this.cordsX[column] + this.cordsY[row];
      const piece_square = this.get_square_piece(row, column);
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
        return;
      }
      if (( row == 0 || row == 7 ) && this.newMove.piece_moving == 'p') {
        this.showPropotionMenu(this.newMove.from, this.newMove.to);
      } else {
        this.chess.move({ from: this.newMove.from, to: this.newMove.to });
        this.refresh_board();
        this.newMove = new Move();
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

  load_PGN(portable_game_notation: string) {
    const newPGN = ['[Event "Casual Game"]',
    '[Site "Berlin GER"]',
    '[Date "1852.??.??"]',
    '[EventDate "?"]',
    '[Round "?"]',
    '[Result "1-0"]',
    '[White "Adolf Anderssen"]',
    '[Black "Jean Dufresne"]',
    '[ECO "C52"]',
    '[WhiteElo "?"]',
    '[BlackElo "?"]',
    '[PlyCount "47"]',
    '',
    '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O',
    'd3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4',
    'Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6',
    'Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8',
    '23.Bd7+ Kf8 24.Bxe7# 1-0'];
    this.chess.load_pgn(newPGN.join('\n'));
    this.refresh_board();
  }

  undo_move() {
    this.chess.undo();
    this.refresh_board();
  }
}
