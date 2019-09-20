export class Piece {
    name: string;
    color: string;
    value: number;
    image: string;

    constructor(value?: string) {
        if ( typeof value === 'undefined') {
            value = '';
        }
        this.getPiece(value);
    }

    getPiece(value: string) {
        let name = '';
        let color = '';
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
                color = 'white';
            } else {
                color = 'black';
            }
            name = Names[value.toLowerCase()];
            this.set(name, color);
        } else {
            this.name = '';
            this.color = '';
            this.image = '';
        }
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
        this.value = Valores[this.name];
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