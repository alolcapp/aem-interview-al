import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LocalDbService } from './local-db.service';

const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
    private localDb: LocalDbService
  ) { }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  /**
   * Logs in against the API. When the API rejects the request or can't be
   * reached, falls back to the credentials stored in PouchDB from the last
   * successful login.
   */
  login(username: string, password: string): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/account/login`, { username, password }).pipe(
      switchMap(token => from(this.localDb.saveUser(username, password, token)).pipe(map(() => token))),
      catchError(error => from(this.localDb.findUser(username, password)).pipe(
        map(user => {
          if (!user) {
            throw error;
          }
          return user.token;
        })
      )),
      tap(token => localStorage.setItem(TOKEN_KEY, token))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
