import { Piece } from "./piece";

export class Board {
    private pieces: any[];
    private position = [];
    public game_time = 0;

    constructor(startPosition: string, game_time?: number) {
        this.newPosition(startPosition);
        if( typeof(game_time) == 'undefined') {
            this.game_time = 300;
        } else {
            this.game_time = game_time * 60;
        }
    }

    newPosition(position: string) {
        this.position = [];
        const board_squares = position.split('/');
        for(let row = 0; row < board_squares.length; row++) {
            const newRow = [];
            for(let column = 0; column < board_squares[row].length; column++) {
                const value: string = board_squares[row][column];
                if (this.is_numeric(value)) {
                    for(let i = 0; i < parseInt(value); i++) {
                        newRow.push('');
                    }
                } else {
                    newRow.push(value);
                }
            }
            this.position.push(newRow);
        }
        this.drawBoard();
    }

    is_numeric(str){
        return /^\d+$/.test(str);
    }

    drawBoard() {
        this.pieces = [];
        for ( let row = 0; row < 8 ; row ++) {
            const rowArray = [];
            for ( let column = 0; column < 8; column ++) {
                const piece = new Piece(this.position[row][column]);
                rowArray.push(piece);
            }
            this.pieces.push(rowArray);
        }
    }
 }