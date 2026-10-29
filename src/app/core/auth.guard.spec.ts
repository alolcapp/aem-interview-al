import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: auth }]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('allows access when logged in', () => {
    auth.isLoggedIn.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
  });

  it('redirects to sign in when not logged in', () => {
    auth.isLoggedIn.and.returnValue(false);
    const result = guard.canActivate() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/sign-in');
  });
});
