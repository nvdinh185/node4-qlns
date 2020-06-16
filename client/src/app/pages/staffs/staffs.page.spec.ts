import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StaffsPage } from './staffs.page';

describe('StaffsPage', () => {
  let component: StaffsPage;
  let fixture: ComponentFixture<StaffsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
