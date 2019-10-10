export class Move {
   from: string;
   to: string;
   piece_moving: string;
   piece_moving_color: string;

   constructor() {
      this.from = '';
      this.to = '';
      this.piece_moving = '';
      this.piece_moving_color = '';
   }
}