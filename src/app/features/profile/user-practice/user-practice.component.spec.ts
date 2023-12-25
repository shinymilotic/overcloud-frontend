import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserPracticeComponent } from "./user-practice.component";

describe("UserPracticeComponent", () => {
  let component: UserPracticeComponent;
  let fixture: ComponentFixture<UserPracticeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPracticeComponent],
    });
    fixture = TestBed.createComponent(UserPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
