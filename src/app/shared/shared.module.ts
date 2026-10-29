import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagInputComponent } from './tag-input/tag-input.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TagInputComponent
  ],
  exports: [
    TagInputComponent
  ]
})
export class SharedModule { }
