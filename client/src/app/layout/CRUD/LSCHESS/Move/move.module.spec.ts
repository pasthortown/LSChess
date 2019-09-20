import { MoveModule } from './move.module';

describe('MoveModule', () => {
   let blackPageModule: MoveModule;

   beforeEach(() => {
      blackPageModule = new MoveModule();   });

   it('should create an instance', () => {
      expect(blackPageModule).toBeTruthy();
   });
});