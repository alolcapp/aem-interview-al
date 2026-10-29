import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { LocalDbService } from './local-db.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let localDb: jasmine.SpyObj<LocalDbService>;

  const loginUrl = `${environment.apiUrl}/account/login`;

  beforeEach(() => {
    localStorage.clear();
    localDb = jasmine.createSpyObj('LocalDbService', ['saveUser', 'findUser']);
    localDb.saveUser.and.resolveTo();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LocalDbService, useValue: localDb }]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('logs in and stores the token', done => {
    service.login('user@aemenersol.com', 'Test@123').subscribe(token => {
      expect(token).toBe('abc');
      expect(service.token).toBe('abc');
      expect(service.isLoggedIn()).toBeTrue();
      expect(localDb.saveUser).toHaveBeenCalledWith('user@aemenersol.com', 'Test@123', 'abc');
      done();
    });

    const req = http.expectOne(loginUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'user@aemenersol.com', password: 'Test@123' });
    req.flush('abc');
  });

  it('falls back to PouchDB when the API fails', done => {
    localDb.findUser.and.resolveTo({ _id: 'user:a', passwordHash: 'x', token: 'cached' });

    service.login('a', 'b').subscribe(token => {
      expect(token).toBe('cached');
      expect(service.token).toBe('cached');
      done();
    });

    http.expectOne(loginUrl).error(new ProgressEvent('error'));
  });

  it('fails when neither the API nor PouchDB accept the credentials', done => {
    localDb.findUser.and.resolveTo(null);

    service.login('a', 'wrong').subscribe({
      error: err => {
        expect(err.status).toBe(400);
        expect(service.isLoggedIn()).toBeFalse();
        done();
      }
    });

    http.expectOne(loginUrl).flush('Invalid', { status: 400, statusText: 'Bad Request' });
  });

  it('clears the token on logout', () => {
    localStorage.setItem('token', 'abc');
    service.logout();
    expect(service.token).toBeNull();
  });
});
