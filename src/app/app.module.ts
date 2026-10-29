import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRouting } from './app.routing';
import { AppPage } from './app.page';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { TokenInterceptor } from './core/token.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouting
  ],
  declarations: [
    AppPage,
    TitleBarComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppPage]
})
export class AppModule { }
