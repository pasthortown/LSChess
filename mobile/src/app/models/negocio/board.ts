import { Piece } from "./piece";

export class Board {
    private pieces: any[];
    public position = [];
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

    is_numeric(str: string) {
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

    check(turn: string) {
        this.pieces.forEach(row => {
            row.forEach(piece => {
                if (piece.name == 'king' && piece.color == turn) {
                    piece.set('king', 'check');
                }
            }); 
        });
    }

    drawPossibleMoves(possibleMoves: any[], piece: string) {
        this.drawBoard();
        const coordsX = { a: '0',
                          b: '1',
                          c: '2',
                          d: '3',
                          e: '4',
                          f: '5',
                          g: '6',
                          h: '7',
                        };
        const coordsY = { 8: '0',
                          7: '1',
                          6: '2',
                          5: '3',
                          4: '4',
                          3: '5',
                          2: '6',
                          1: '7',
                        };
        possibleMoves.forEach(possibleMove => {
            const column = coordsX[possibleMove.to.substr(0,1)];
            const row = coordsY[possibleMove.to.substr(1,1)];
            if (typeof(possibleMove.captured) == 'undefined') {
                this.pieces[row][column] = new Piece(piece, 'shadow');
            } else {
                this.pieces[row][column] = new Piece(possibleMove.captured, 'capture');
            } 
        });
    }
 }