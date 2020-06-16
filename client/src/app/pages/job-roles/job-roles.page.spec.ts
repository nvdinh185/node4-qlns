import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JobRolesPage } from './job-roles.page';

describe('JobRolesPage', () => {
  let component: JobRolesPage;
  let fixture: ComponentFixture<JobRolesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobRolesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JobRolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
