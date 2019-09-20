import { Move } from './Move';

export class Game {
   id: number;
   id_player_white: number;
   id_player_black: number;
   start_time: Date;
   end_time: Date;
   start_position: String;
   start_move: String;
   game_state_id: number;
   moves_on_game: Move[];
   constructor() {
      this.moves_on_game = [];
   }
}