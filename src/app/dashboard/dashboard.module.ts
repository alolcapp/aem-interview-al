import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRouting } from './dashboard.routing';
import { DashboardPage } from './dashboard.page';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRouting
  ],
  declarations: [
    DashboardPage,
    ChartComponent
  ]
})
export class DashboardModule { }
