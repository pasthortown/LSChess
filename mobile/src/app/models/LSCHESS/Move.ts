export class Move {
   id: number;
   from: string;
   to: string;
   moment: Date;
   pgn: string;
   piece_moving: string;
   piece_moving_color: string;

   constructor() {
      this.from = '';
      this.to = '';
      this.moment = new Date();
      this.pgn = '';
      this.piece_moving = '';
      this.piece_moving_color = '';
      this.id = 0;
   }
}