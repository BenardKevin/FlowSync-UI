import { TestBed } from '@angular/core/testing';

import { NavItemService } from './nav-item.service';

describe('MenuItemService', () => {
  let service: NavItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
