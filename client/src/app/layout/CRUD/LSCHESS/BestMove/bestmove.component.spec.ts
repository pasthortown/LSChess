import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BestMoveComponent } from './bestmove.component';

describe('BestMoveComponent', () => {
   let component: BestMoveComponent;
   let fixture: ComponentFixture<BestMoveComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BestMoveComponent]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BestMoveComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});