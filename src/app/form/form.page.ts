import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss']
})
export class FormPage {

  formRegister = this.formBuilder.group({
    name: this.formBuilder.group({
      first: '',
      last: ''
    }),
    email: '',
    phone: this.formBuilder.group({
      mobile: ''
    }),
    skills: [['skill 1', 'skill 2']]
  });

  // Same component bound with ngModel
  hobbies: string[] = ['reading'];

  constructor(private formBuilder: FormBuilder) { }
}
