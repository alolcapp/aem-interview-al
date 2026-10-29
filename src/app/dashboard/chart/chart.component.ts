import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

import { ChartItem } from '../dashboard.service';

const LIGHT = {
  colors: ['#cccccc', '#9e9e9e', '#b3b3b3', '#bdbdbd', '#8a8a8a', '#d6d6d6'],
  bar: '#9e9e9e',
  text: '#444',
  line: '#e0e0e0'
};

const DARK = {
  colors: ['#e5e5e5', '#e6b400', '#8a8a8a', '#525252', '#b3b3b3', '#2e2e2e'],
  bar: '#e5e5e5',
  peak: '#e6b400',
  text: '#8a8a8a',
  line: '#e5e5e5',
  grid: '#262626'
};

@Component({
  selector: 'app-chart',
  template: '<div #chart class="chart"></div>',
  styles: ['.chart { height: 250px; }']
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() type: 'donut' | 'bar' = 'bar';
  @Input() data: ChartItem[] = [];

  @ViewChild('chart') chart?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      Plotly.purge(this.chart.nativeElement);
    }
  }

  private render(): void {
    if (!this.chart) {
      return;
    }

    const dark = document.documentElement.classList.contains('desktop');
    const labels = this.data.map(item => item.name);
    const values = this.data.map(item => item.value);
    const trace = this.type === 'donut'
      ? this.donut(labels, values, dark)
      : this.bar(labels, values, dark);

    const layout: Partial<Plotly.Layout> = {
      margin: { t: 10, r: 10, b: 30, l: 36 },
      showlegend: false,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: dark ? DARK.text : LIGHT.text, size: dark ? 11 : 12 },
      xaxis: { showgrid: false, fixedrange: true },
      yaxis: { showgrid: false, showline: true, linecolor: LIGHT.line, fixedrange: true }
    };

    if (dark) {
      layout.bargap = 0.55;
      layout.hoverlabel = { bgcolor: '#161616', bordercolor: '#262626', font: { color: '#fff' } };
      layout.xaxis = { showgrid: false, showline: true, linecolor: DARK.line, fixedrange: true };
      layout.yaxis = { showgrid: true, gridcolor: DARK.grid, griddash: 'dash', zeroline: false, showline: false, fixedrange: true };

      if (this.type === 'donut') {
        const total = values.reduce((sum, value) => sum + value, 0);
        layout.annotations = [
          { text: `${total}`, showarrow: false, y: 0.54, font: { size: 26, color: '#fff' } },
          { text: 'TOTAL', showarrow: false, y: 0.4, font: { size: 10, color: DARK.text } }
        ];
      }
    }

    Plotly.react(this.chart.nativeElement, [trace], layout, { displayModeBar: false, responsive: true });
  }

  private donut(labels: string[], values: number[], dark: boolean): Plotly.Data {
    return {
      type: 'pie',
      labels,
      values,
      hole: dark ? 0.78 : 0.5,
      sort: false,
      textinfo: 'none',
      marker: {
        colors: dark ? DARK.colors : LIGHT.colors,
        line: { color: dark ? '#0d0d0d' : 'transparent', width: dark ? 3 : 0 }
      }
    };
  }

  private bar(labels: string[], values: number[], dark: boolean): Plotly.Data {
    if (!dark) {
      return { type: 'bar', x: labels, y: values, marker: { color: LIGHT.bar } };
    }

    // Highlight the highest bar with the accent color
    const peak = Math.max(...values);
    return {
      type: 'bar',
      x: labels,
      y: values,
      marker: { color: values.map(value => value === peak ? DARK.peak : DARK.bar) }
    };
  }
}
