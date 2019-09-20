import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/negocio/board';
import * as Chess from 'chess.js';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  appName = environment.app_name;
  chess: Chess = new Chess();
  board: Board;

  constructor() { 
    this.board = new Board(this.chess.fen().split(' ')[0],5);
  }

  play() {
    let possibleMoves = this.chess.moves();
    console.log(possibleMoves);
    let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    this.chess.move(move);
    this.board.newPosition(this.chess.fen().split(' ')[0]);
  }

  ngOnInit() {
  }
}
