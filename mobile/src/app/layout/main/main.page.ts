import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/negocio/board';
import * as Chess from 'chess.js';
import { Move } from 'src/app/models/LSCHESS/Move';

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

  constructor() { 
    this.board = new Board(this.chess.fen().split(' ')[0],5);
  }

  ngOnInit() {
  }

  play_pc() {
    const gameOver = this.chess.game_over();
    if (!gameOver) {
      let possibleMoves = this.get_possible_moves();
      let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      this.chess.move(move);
      this.refresh_board();
    } else {
      console.log(gameOver);
    }
  }

  refresh_board() {
    this.board.newPosition(this.chess.fen().split(' ')[0]);
  }

  move(row: number, column: number) {
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
      if (row == 0 || row == 7 && this.newMove.piece_moving == 'p') {
        // mejorar la promocion
        this.chess.move({ from: this.newMove.from, to: this.newMove.to, promotion: 'q'});
      } else {
        this.chess.move({ from: this.newMove.from, to: this.newMove.to });
      }
      console.log(this.check_specials());
      this.refresh_board();
      this.newMove = new Move();
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

  check_specials() {
    if (this.chess.in_check()) {
      alert('jaque');
    }
    if (this.chess.in_checkmate()) {
      alert('jaque mate');
    }
    if (this.chess.in_draw()) {
      alert('tabla');
    }
    if (this.chess.in_stalemate()) {
      alert('ahogado');
    }
    if (this.chess.in_threefold_repetition()) {
      alert('tres posiciones iguales');
    }
    if (this.chess.insufficient_material()) {
      alert('Material insuficiente');
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

  get_PGN() {
    return this.chess.pgn({ max_width: 5, newline_char: '<br />' });
  }

  undo_move() {
    this.chess.undo();
    this.refresh_board();
  }
}
