import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LocalDbService } from '../core/local-db.service';

export interface ChartItem {
  name: string;
  value: number;
}

export interface TableUser {
  firstName: string;
  lastName: string;
  username: string;
}

export interface Dashboard {
  chartDonut: ChartItem[];
  chartBar: ChartItem[];
  tableUsers: TableUser[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    private http: HttpClient,
    private localDb: LocalDbService
  ) { }

  /** Loads dashboard data, using the last cached copy when the API is unavailable. */
  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${environment.apiUrl}/dashboard`).pipe(
      tap(data => this.localDb.saveDashboard(data)),
      catchError(error => from(this.localDb.getDashboard<Dashboard>()).pipe(
        map(cached => {
          if (!cached) {
            throw error;
          }
          return cached;
        })
      ))
    );
  }
}
