import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Board } from 'src/app/models/negocio/board';
import * as Chess from 'chess.js';
import { Move } from 'src/app/models/negocio/move';
import Swal from 'sweetalert2'
import { saveAs } from 'file-saver/FileSaver';
import { Cycle } from 'src/app/models/negocio/cycle';
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Piece } from 'src/app/models/negocio/piece';
import { BestMoveService } from 'src/app/services/CRUD/LSCHESS/bestmove.service';
import { BestMove } from 'src/app/models/LSCHESS/BestMove';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    @ViewChild("pawnPromotionModalDialog") pawnPromotionModalDialog;
    chess: Chess = new Chess();
    board: Board;
    player_white = 'Blancas';
    player_black = 'Negras';
    next_turn = 'white';
    white_can_queen_castling = true;
    white_can_king_castling = true;
    black_can_queen_castling = true;
    black_can_king_castling = true;
    newMove: Move = new Move();
    cordsX = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    cordsXI = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    cordsY = ['8', '7', '6', '5', '4', '3', '2', '1'];
    tiempoNegras = '10:00';
    tiempoBlancas = '10:00';
    editarPosicion = false;
    current_position = '';
    learning = false;
    timeNegras = 600;
    timeBlancas = 600;
    time_running = false;
    user = '';
    current_move = 0;
    checking_move = 0;
    value_of_position = {white_position: 0, black_position: 0, white_pieces: 0, black_pieces: 0, white_movility: 0, black_movility: 0};
    sizeLeftPanel = 6;
    sizeRightPanel = 6;
    editing_from = {row: null, colum: null};
    addingPiece = new Piece('');
    new_best_move = new BestMove();

    constructor(private modalDialog: NgbModal, private bestMoveDataService: BestMoveService) {
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

      white_king_castling() {
        if (this.white_can_king_castling) {
          this.white_can_king_castling = false;
        } else {
          this.white_can_king_castling = true;
        }
      }

      selectBuildingPiece(row: number, colum: number) {
        if (this.editing_from.row != null) {
          this.board.drawBoard();
        }
        this.editing_from.colum = null;
        this.editing_from.row = null;
        this.addingPiece = this.board.selectAddingPiece(row, colum);
      }

      evaluateBoard(turn) {
        if (turn == 'white') {
          this.value_of_position.white_pieces = 0;
          this.value_of_position.white_movility = 0;
          this.value_of_position.white_position = 0;
        } else {
          this.value_of_position.black_pieces = 0;
          this.value_of_position.black_movility = 0;
          this.value_of_position.black_position = 0;
        }
        for(let row_selected = 0; row_selected < 8; row_selected ++) {
          for(let column_selected = 0; column_selected < 8; column_selected ++) {
            let row = 0;
            let column = 0;
            if(this.board.white_side) {
              row = row_selected;
              column = column_selected;
            } else {
              row = 7-row_selected;
              column = 7-column_selected;
            }
            const square = this.cordsX[column] + this.cordsY[row];
            const piece = this.board.get_piece(row, column);
            if (piece.name !== '') {
              if (turn == 'white') {
                if (piece.color == 'white') {
                  this.value_of_position.white_pieces += piece.numerical_value;
                  this.value_of_position.white_movility += this.get_possible_moves(square).length;
                  this.value_of_position.white_position = this.value_of_position.white_pieces + this.value_of_position.white_movility;
                }
              } else {
                if (piece.color == 'black') {
                  this.value_of_position.black_pieces += piece.numerical_value;
                  this.value_of_position.black_movility += this.get_possible_moves(square).length;
                  this.value_of_position.black_position = this.value_of_position.black_pieces + this.value_of_position.black_movility;
                }
              }
            }
          }
        }
      }

      white_queen_castling() {
        if (this.white_can_queen_castling) {
          this.white_can_queen_castling = false;
        } else {
          this.white_can_queen_castling = true;
        }
      }

      black_king_castling() {
        if (this.black_can_king_castling) {
          this.black_can_king_castling = false;
        } else {
          this.black_can_king_castling = true;
        }
      }

      black_queen_castling() {
        if (this.black_can_queen_castling) {
          this.black_can_queen_castling = false;
        } else {
          this.black_can_queen_castling = true;
        }
      }

      set_learning() {
        if (this.learning) {
          this.learning = false;
        } else {
          this.learning = true;
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

      cleanBoard() {
        this.board.newPosition('8/8/8/8/8/8/8/8');
        this.board.disableMaxCounts();
      }

      resetBoard(){
        this.board.newPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
        this.board.disableMaxCounts();
      }

      set_next_turn() {
        if (this.next_turn == 'white') {
          this.next_turn = 'black';
        } else {
          this.next_turn = 'white';
        }
      }

      finishSetPosition() {
        this.editarPosicion = false;
        this.set_position(this.board.get_fen());
      }

      cancelSetPosition() {
        this.editarPosicion = false;
        this.refresh_board();
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
        this.check_specials();
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
          if ((this.current_move == this.checking_move) && !this.editarPosicion) {
            this.timeBlancas = this.timeBlancas - 1;
          }
          this.refreshClock() 
        } else {
          if ((this.current_move == this.checking_move) && !this.editarPosicion) { 
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
    
      showPropotionMenu(from: string, to: string) {
        this.board.piecesPromote.forEach(piece => {
          piece.setColor(this.get_turn());
        });
        this.modalDialog.open(this.pawnPromotionModalDialog, { centered: true }).result.then(
          result => {
            const pieces = {
              rook: 'r',
              knight: 'n',
              bishop: 'b',
              queen: 'q',
              king: 'k',
              pawn: 'p',
            };
            this.chess.move({ from: from, to: to, promotion: pieces[result]});
            this.learn_move();
            this.newMove = new Move();
            this.refresh_board();
        }, cancel => {
            this.chess.move({ from: from, to: to, promotion: 'q'});
            this.learn_move();
            this.newMove = new Move();
            this.refresh_board();
        });
      }
    
      play_pc() {
        /*
        const gameOver = this.chess.game_over();
        if (!gameOver) {
          let possibleMoves = this.get_possible_moves();
          let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          this.chess.move(move);
          this.refresh_board();
        }*/
        this.new_best_move.current_position = this.chess.fen().split(' ')[0] + ' ' + this.chess.turn();
        this.bestMoveDataService.find(this.new_best_move.current_position).then( r => {
          const response = r as any[];
          if (response.length > 0) {
            this.chess.move(response[0].response);
            this.refresh_board();
          }
        }).catch( e => { console.log(e); });
      }
    
      establecerPosicion() {
        this.board.disableMaxCounts();
        this.editarPosicion = true;
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
        if (this.editarPosicion) {
          if (this.addingPiece.get_symbol() !== 'empty') {
            this.board.position[row][column] = this.addingPiece.get_symbol();
            this.addingPiece = new Piece('');
            this.board.drawBoard();
            this.board.unselectBuildingPiece();
            this.board.disableMaxCounts();
          } else {
            if (this.board.position[row][column] == '' && this.editing_from.row == null) {
              return;
            }
            if (this.editing_from.row == null) {
              this.editing_from.row = row;
              this.editing_from.colum = column;
              this.board.disableMaxCounts();
              this.board.selectPiece(row_selected, column_selected);
            } else {
              if ((this.editing_from.row == row) && (this.editing_from.colum == column)) {
                this.board.position[row][column] = '';
              } else {
                this.board.position[row][column] = this.board.position[this.editing_from.row][this.editing_from.colum];
                this.board.position[this.editing_from.row][this.editing_from.colum] = '';
              }
              this.board.disableMaxCounts();
              this.board.drawBoard();
              this.editing_from.row = null;
              this.editing_from.colum = null;
            }
          }
        } else {
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
            this.new_best_move.current_position = this.chess.fen().split(' ')[0] + ' ' + this.chess.turn();
            if (( row == 0 || row == 7 ) && this.newMove.piece_moving == 'p') {
              this.showPropotionMenu(this.newMove.from, this.newMove.to);
            } else {
              this.chess.move({ from: this.newMove.from, to: this.newMove.to });
              this.learn_move();
              this.refresh_board();
              this.newMove = new Move();
              this.current_move++;
              this.checking_move = this.current_move;
            }
          }
        }
      }
    
      learn_move() {
        if (!this.learning) {
          return;
        }
        this.bestMoveDataService.find(this.new_best_move.current_position).then(
          r => {
            const response = r as any[];
            this.new_best_move.response = this.get_last_move();
            let in_knowledge = false;
            response.forEach(best_response => {
              if (best_response.response == this.new_best_move.response) {
                in_knowledge = true;
              }
            });
            if (!in_knowledge) {
              this.bestMoveDataService.post(this.new_best_move).then(r1 => {
                console.log('Aprendido');
              }).catch( e => { console.log(e); });
            } else {
              console.log('Conocido');
            }
          }
        ).catch( e => { console.log(e); });
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
        let toReturn = turn[this.chess.turn()]
        this.evaluateBoard(toReturn);
        return toReturn;
      }
      
      get_PGN() {
        return '<strong>Histórico</strong><br/>' + this.chess.pgn({ max_width: 5, newline_char: '<br />' });
      }
    
      get_last_move() {
        const totalPGN = this.chess.pgn({ max_width: 5, newline_char: '\n' }).split('\n');
        if (totalPGN != "") {
          const lastLine = totalPGN[totalPGN.length - 1].split('. ')[1];
          const moves = lastLine.split(' ');
          return moves[moves.length - 1];
        } else {
          return totalPGN;
        }
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
        let castlings = '';
        let turn = 'b';
        if (this.white_can_king_castling) {
          castlings += 'K';
        }
        if (this.white_can_queen_castling) {
          castlings += 'Q';
        }
        if (this.black_can_king_castling) {
          castlings += 'k';
        }
        if (this.black_can_queen_castling) {
          castlings += 'q';
        }
        if (castlings == '') {
          castlings = '-';
        }
        if (this.next_turn == 'white') {
          turn = 'w';
        }
        const newPosition = position + ' ' + turn + ' ' + castlings + ' - 0 1';
        if ((position.search('k') > -1) && (position.search('K') > -1)) {
          this.chess.load(newPosition);
        }
        this.refresh_board();
      }
    
      undo_move() {
        this.chess.undo();
        this.refresh_board();
      }
}
