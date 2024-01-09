import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchArticlesComponent } from './search-articles.component';

describe('SearchArticlesComponent', () => {
  let component: SearchArticlesComponent;
  let fixture: ComponentFixture<SearchArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchArticlesComponent]
    });
    fixture = TestBed.createComponent(SearchArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
