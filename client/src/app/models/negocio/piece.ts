export class Piece {
    public name: string;
    color: string;
    value: number;
    image: string;
    max_count: number;

    constructor(value?: string, color?: string) {
        if ( typeof value === 'undefined') {
            value = '';
        }
        if ( typeof color === 'undefined') {
            this.getPiece(value);
        } else {
            this.getPiece(value, color);
        }
    }

    getPiece(value: string, color?: string) {
        let name = '';
        let piece_color = '';
        const Names = {
            r: 'rook',
            n: 'knight',
            b: 'bishop',
            q: 'queen',
            k: 'king',
            p: 'pawn',
        };
        if (value !== ''){
            if (value.toUpperCase() == value ) {
                piece_color = 'white';
            } else {
                piece_color = 'black';
            }
            if ( typeof color !== 'undefined') {
                piece_color = color;
            }
            name = Names[value.toLowerCase()];
            this.set(name, piece_color);
        } else {
            this.name = '';
            this.color = '';
            this.image = '';
        }
    }

    public get_symbol() {
        const symbols = {
            rook: 'r',
            knight: 'n',
            bishop: 'b',
            queen: 'q',
            king: 'k',
            pawn: 'p',
            '': 'empty',
        };
        const symbol = symbols[this.name];
        if ( this.color == 'white') {
            return symbol.toUpperCase();
        }
        return symbol;
    }

    public set(name: string, color: string) {
        this.name = name;
        this.color = color;
        const Valores = {
            rook: 5,
            knight: 3,
            bishop: 3,
            queen: 9,
            king: 1000,
            pawn: 1,
        };
        const max = {
            rook: 10,
            knight: 10,
            bishop: 10,
            queen: 9,
            king: 1,
            pawn: 8,
        };
        this.max_count = max[this.name];
        this.value = Valores[this.name];
        this.refresh();
    }

    setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    public refresh() {
        if (this.name !== '') {
            this.image = this.color + ' fas fa-chess-' + this.name;
        } else {
            this.image = '';
        }
    }
}