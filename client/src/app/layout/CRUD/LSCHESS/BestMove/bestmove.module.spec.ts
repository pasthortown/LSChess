import { BestMoveModule } from './bestmove.module';

describe('BestMoveModule', () => {
   let blackPageModule: BestMoveModule;

   beforeEach(() => {
      blackPageModule = new BestMoveModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});