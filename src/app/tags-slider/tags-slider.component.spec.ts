import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TagsSliderComponent } from "./tags-slider.component";

describe("TagsSliderComponent", () => {
  let component: TagsSliderComponent;
  let fixture: ComponentFixture<TagsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TagsSliderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
