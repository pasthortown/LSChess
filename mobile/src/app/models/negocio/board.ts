import { Piece } from "./piece";

export class Board {
    private pieces: any[];
    public position = [];
    public game_time = 0;
    public captured_by_white: Piece[] = [];
    public captured_by_black: Piece[] = [];
    public white_side = true;
    public piecesPromote: Piece[] = [
        new Piece("r"),
        new Piece("n"),
        new Piece("b"),
        new Piece("q")
    ];
    public buildingPieces: any[] = [
        [new Piece("r", "white"),
        new Piece("n", "white"),
        new Piece("b", "white"),
        new Piece("q", "white"),
        new Piece("k", "white"),
        new Piece("p", "white")],
        [new Piece("r", "black"),
        new Piece("n", "black"),
        new Piece("b", "black"),
        new Piece("q", "black"),
        new Piece("k", "black"),
        new Piece("p", "black")]
    ];

    constructor(startPosition: string, game_time?: number) {
        this.newPosition(startPosition);
        if( typeof(game_time) == 'undefined') {
            this.game_time = 300;
        } else {
            this.game_time = game_time * 60;
        }
    }

    rotate_board() {
       if (this.white_side) {
           this.white_side = false;
       } else {
           this.white_side = true;
       }
       this.drawBoard();
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

    get_fen() {
        let toReturn = '';
        this.position.forEach(row => {
            let empty_count = 0;
            row.forEach(symbol => {
                if (symbol == '') {
                    empty_count++;
                } else {
                    if (empty_count > 0) {
                        toReturn += empty_count.toString();
                        empty_count = 0;    
                    }
                    toReturn += symbol;
                }
            });
            if (empty_count > 0) {
                toReturn += empty_count.toString();    
            }
            toReturn+='/';
        });
        return toReturn.substring(0, toReturn.length - 1);
    }

    drawBoard() {
        this.pieces = [];
        this.captured_by_black = [];
        this.captured_by_white = [];
        const origins = { r: 2, n: 2, b: 2, q: 1, p: 8, R: 2, N: 2, B: 2, Q: 1, P: 8, K: 1, k: 1};
        let residues = { r: 0, n: 0, b: 0, q: 0, p: 0, R: 0, N: 0, B: 0, Q: 0, P: 0, K: 0, k: 0};
        for ( let row = 0; row < 8 ; row ++) {
            const rowArray = [];
            for ( let column = 0; column < 8; column ++) {
                let piece = new Piece();
                if (this.white_side) {
                    piece = new Piece(this.position[row][column]);    
                } else {
                    piece = new Piece(this.position[7-row][7-column]);   
                }
                residues[this.position[row][column]] = residues[this.position[row][column]] + 1;
                rowArray.push(piece);
            }
            this.pieces.push(rowArray);
        }
        const toCheck = ['r', 'n', 'b', 'q', 'p'];
        toCheck.forEach(elementBlack => {
            for (let i = 0; (i < origins[elementBlack] - residues[elementBlack]) && (origins[elementBlack] - residues[elementBlack] > 0); i++) {
                this.captured_by_white.push(new Piece(elementBlack, 'black'));
            }
            const elementWhite = elementBlack.toUpperCase();
            for (let i = 0; (i < origins[elementWhite] - residues[elementWhite]) && (origins[elementWhite] - residues[elementWhite] > 0); i++) {
                this.captured_by_black.push(new Piece(elementWhite, 'white'));
            }
        });
    }

    unselectBuildingPiece() {
        this.buildingPieces[0].forEach(piece => {
            piece.setColor('white');
        });
        this.buildingPieces[1].forEach(piece => {
            piece.setColor('black');
        });
    }

    selectPiece(row: number, column: number) {
        this.pieces[row][column].setColor('selected');
    }

    disableMaxCounts() {
        this.unselectBuildingPiece();
        this.buildingPieces.forEach(row => {
            row.forEach(piece => {
                const checkingSymbol = piece.get_symbol();
                const checkingMaxCount = piece.get_max_count();
                let currentCount = 0;
                this.position.forEach(position_row => {
                    position_row.forEach(position_value => {
                        if (position_value == checkingSymbol) {
                            currentCount++;
                        }   
                    });
                });
                if (currentCount == checkingMaxCount) {
                    piece.setColor('disabled');
                }
            });
        });
    }

    selectAddingPiece(row:number, column: number) {
        this.unselectBuildingPiece();
        this.disableMaxCounts();
        if (this.buildingPieces[row][column].get_color() == 'disabled') {
            return new Piece('');
        }
        let toReturn = new Piece(this.buildingPieces[row][column].get_symbol(), this.buildingPieces[row][column].get_color()); 
        this.buildingPieces[row][column].setColor('selected');
        return toReturn;
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
        let coordsX = { a: '0',
                          b: '1',
                          c: '2',
                          d: '3',
                          e: '4',
                          f: '5',
                          g: '6',
                          h: '7',
                        };
        let coordsY = { 8: '0',
                          7: '1',
                          6: '2',
                          5: '3',
                          4: '4',
                          3: '5',
                          2: '6',
                          1: '7',
                        };
        if (!this.white_side) {
            coordsX = { a: '7',
                b: '6',
                c: '5',
                d: '4',
                e: '3',
                f: '2',
                g: '1',
                h: '0',
            };
            coordsY = { 8: '7',
                7: '6',
                6: '5',
                5: '4',
                4: '3',
                3: '2',
                2: '1',
                1: '0',
            };
        }
        possibleMoves.forEach(possibleMove => {
            const columnFrom = coordsX[possibleMove.from.substr(0,1)];
            const rowFrom = coordsY[possibleMove.from.substr(1,1)];
            const column = coordsX[possibleMove.to.substr(0,1)];
            const row = coordsY[possibleMove.to.substr(1,1)];
            this.pieces[rowFrom][columnFrom] = new Piece(piece, 'selected');
            if (typeof(possibleMove.captured) == 'undefined') {
                this.pieces[row][column] = new Piece(piece, 'shadow');
            } else {
                this.pieces[row][column] = new Piece(possibleMove.captured, 'capture');
            } 
        });
    }

    get_piece(row, column): Piece {
        let piece_color = '';
        if (this.position[row][column] !== '') {
            if(this.position[row][column].toUpperCase() == this.position[row][column]) {
                piece_color = 'white';
            } else {
                piece_color = 'black';
            }
        }
        return new Piece(this.position[row][column], piece_color);
    }
 }