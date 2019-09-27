import { NotFoundModule } from './not-found.module';

describe('NotFoundModule', () => {
  let blackPageModule: NotFoundModule;

  beforeEach(() => {
    blackPageModule = new NotFoundModule();
  });

  it('should create an instance', () => {
    expect(blackPageModule).toBeTruthy();
  });
});
