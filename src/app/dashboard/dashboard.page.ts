import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../core/auth.service';
import { desktop } from '../core/desktop';
import { ChartItem, Dashboard, DashboardService } from './dashboard.service';

export interface Stat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  isDesktop = !!desktop;
  dashboard?: Dashboard;
  donutStats: Stat[] = [];
  barStats: Stat[] = [];
  error = '';

  constructor(
    private dashboardService: DashboardService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: data => {
        this.dashboard = data;
        this.donutStats = this.stats(data.chartDonut, 'Largest');
        this.barStats = this.stats(data.chartBar, 'Peak');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.signOut();
          return;
        }
        this.error = 'Failed to load dashboard data.';
      }
    });
  }

  /** Summary shown under each chart in the desktop app. */
  private stats(items: ChartItem[], topLabel: string): Stat[] {
    if (!items.length) {
      return [];
    }
    const total = items.reduce((sum, item) => sum + item.value, 0);
    const top = items.reduce((max, item) => item.value > max.value ? item : max);
    return [
      { label: topLabel, value: `${top.name} · ${top.value}` },
      { label: 'Average', value: (total / items.length).toFixed(1) },
      { label: 'Items', value: `${items.length}` }
    ];
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/sign-in']);
  }
}
