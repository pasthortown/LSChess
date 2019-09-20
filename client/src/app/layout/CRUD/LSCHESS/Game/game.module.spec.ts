import { GameModule } from './game.module';

describe('GameModule', () => {
   let blackPageModule: GameModule;

   beforeEach(() => {
      blackPageModule = new GameModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});