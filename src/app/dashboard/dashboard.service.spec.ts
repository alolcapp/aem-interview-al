import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import { LocalDbService } from '../core/local-db.service';
import { Dashboard, DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let http: HttpTestingController;
  let localDb: jasmine.SpyObj<LocalDbService>;

  const url = `${environment.apiUrl}/dashboard`;
  const data: Dashboard = {
    chartDonut: [{ name: 'Donut 1', value: 25 }],
    chartBar: [{ name: 'Bar 1', value: 30 }],
    tableUsers: [{ firstName: 'John', lastName: 'Doe', username: 'john_doe' }]
  };

  beforeEach(() => {
    localDb = jasmine.createSpyObj('LocalDbService', ['saveDashboard', 'getDashboard']);
    localDb.saveDashboard.and.resolveTo();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LocalDbService, useValue: localDb }]
    });
    service = TestBed.inject(DashboardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads and caches the dashboard', () => {
    let result: Dashboard | undefined;
    service.getDashboard().subscribe(value => result = value);

    http.expectOne(url).flush(data);

    expect(result).toEqual(data);
    expect(localDb.saveDashboard).toHaveBeenCalledWith(data);
  });

  it('returns the cached copy when the API fails', done => {
    localDb.getDashboard.and.resolveTo(data);

    service.getDashboard().subscribe(value => {
      expect(value).toEqual(data);
      done();
    });

    http.expectOne(url).error(new ProgressEvent('error'));
  });
});
