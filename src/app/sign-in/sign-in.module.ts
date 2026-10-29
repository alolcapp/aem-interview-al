import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SignInRouting } from './sign-in.routing';
import { SignInPage } from './sign-in.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SignInRouting
  ],
  declarations: [
    SignInPage
  ]
})
export class SignInModule { }
