export class Piece {
    public name: string;
    color: string;
    numerical_value: number;
    image: string;
    max_count: number;
    symbol: string;
    is_disabled: boolean;
    border_css: string;

    constructor(symbol?: string, color?: string) {
        if ( typeof symbol === 'undefined') {
            symbol = '';
        }
        this.symbol = symbol;
        if ( typeof color === 'undefined') {
            this.getPiece(symbol);
        } else {
            this.getPiece(symbol, color);
        }
        this.border_css = '';
    }

    getPiece(symbol: string, color?: string) {
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
        if (symbol !== ''){
            if (symbol.toUpperCase() == symbol ) {
                piece_color = 'white';
            } else {
                piece_color = 'black';
            }
            if ( typeof color !== 'undefined') {
                piece_color = color;
            }
            name = Names[symbol.toLowerCase()];
            this.set(name, piece_color);
        } else {
            this.name = '';
            this.color = '';
            this.image = '';
        }
    }

    public get_max_count() {
        return this.max_count;
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

    public get_color() {
        return this.color;
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
        this.numerical_value = Valores[this.name];
        this.refresh();
    }

    setColor(color: string) {
        this.color = color;
        this.refresh();
    }

    public refresh() {
        if (this.name !== '') {
            if (this.color == 'selected') {
                this.image = 'selected white' + this.name;
            }
            if (this.color == 'shadow') {
                this.image = 'shadow white' + this.name;
            }
            if (this.color == 'capture') {
                this.image = 'capture white' + this.name;   
            }
            if (this.color == 'check') {
                this.image = 'check white' + this.name;
            }
            if (this.color == 'disabled') {
                this.image = 'disabled white' + this.name;
            }
            if (this.color === 'black' || this.color === 'white') {
                this.image = this.color + this.name;
            }
        } else {
            this.image = '';
        }
    }
}