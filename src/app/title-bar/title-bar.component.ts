import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/auth.service';
import { desktop, DesktopApi } from '../core/desktop';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent {

  maximized = false;

  private api = desktop as DesktopApi;

  constructor(
    zone: NgZone,
    public auth: AuthService,
    private router: Router
  ) {
    // IPC events arrive outside Angular's zone
    this.api.onMaximizedChange(maximized => zone.run(() => this.maximized = maximized));
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/sign-in']);
  }

  minimize(): void {
    this.api.minimize();
  }

  toggleMaximize(): void {
    this.api.toggleMaximize();
  }

  close(): void {
    this.api.close();
  }
}
