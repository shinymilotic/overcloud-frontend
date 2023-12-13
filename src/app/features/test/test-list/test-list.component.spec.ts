import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TestListComponent } from "./test-list.component";

describe("TestListComponent", () => {
  let component: TestListComponent;
  let fixture: ComponentFixture<TestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestListComponent],
    });
    fixture = TestBed.createComponent(TestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
