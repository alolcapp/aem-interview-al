import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TagInputComponent } from './tag-input.component';

@Component({
  template: '<app-tag-input [formControl]="control"></app-tag-input>'
})
class HostComponent {
  control = new FormControl<string[]>(['one'], { nonNullable: true });
}

describe('TagInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let input: HTMLInputElement;

  function type(value: string, key: string): void {
    input.value = value;
    input.dispatchEvent(new KeyboardEvent('keydown', { key }));
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HostComponent, TagInputComponent]
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('renders the initial value', () => {
    expect(fixture.debugElement.queryAll(By.css('.tag')).length).toBe(1);
  });

  it('adds a tag on Enter', () => {
    type('two', 'Enter');
    expect(host.control.value).toEqual(['one', 'two']);
    expect(input.value).toBe('');
  });

  it('ignores empty and duplicate tags', () => {
    type('  ', 'Enter');
    type('one', ',');
    expect(host.control.value).toEqual(['one']);
  });

  it('removes the last tag on Backspace', () => {
    type('', 'Backspace');
    expect(host.control.value).toEqual([]);
  });

  it('removes a tag with its remove button', () => {
    fixture.debugElement.query(By.css('.tag-remove')).nativeElement.click();
    expect(host.control.value).toEqual([]);
  });

  it('updates when the control value changes', () => {
    host.control.setValue(['a', 'b', 'c']);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.tag')).length).toBe(3);
  });
});
