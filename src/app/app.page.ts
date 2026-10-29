import { Component, OnDestroy } from '@angular/core';

import { desktop } from './core/desktop';

@Component({
  selector: 'app-root',
  templateUrl: './app.page.html',
  styleUrls: ['./app.page.scss']
})
export class AppPage implements OnDestroy {

  isDesktop = !!desktop;
  now = new Date();
  city = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()?.replace(/_/g, ' ') ?? '';
  online = navigator.onLine;

  private timer?: ReturnType<typeof setInterval>;
  private updateOnline = () => this.online = navigator.onLine;

  constructor() {
    if (this.isDesktop) {
      document.documentElement.classList.add('desktop');
      this.timer = setInterval(() => this.now = new Date(), 30000);
      window.addEventListener('online', this.updateOnline);
      window.addEventListener('offline', this.updateOnline);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    window.removeEventListener('online', this.updateOnline);
    window.removeEventListener('offline', this.updateOnline);
  }
}
