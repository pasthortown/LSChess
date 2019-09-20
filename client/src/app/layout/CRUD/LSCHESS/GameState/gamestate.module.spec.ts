import { GameStateModule } from './gamestate.module';

describe('GameStateModule', () => {
   let blackPageModule: GameStateModule;

   beforeEach(() => {
      blackPageModule = new GameStateModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});