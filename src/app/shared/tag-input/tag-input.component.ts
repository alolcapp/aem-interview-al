import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagInputComponent),
    multi: true
  }]
})
export class TagInputComponent implements ControlValueAccessor {

  @Input() placeholder = '';
  @Input() allowDuplicates = false;

  @ViewChild('input', { static: true }) input!: ElementRef<HTMLInputElement>;

  tags: string[] = [];
  disabled = false;
  focused = false;

  private onChange: (value: string[]) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(value: string[] | null): void {
    this.tags = Array.isArray(value) ? [...value] : [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onKeydown(event: KeyboardEvent): void {
    const input = this.input.nativeElement;

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.add(input.value);
    } else if (event.key === 'Backspace' && !input.value && this.tags.length) {
      this.remove(this.tags.length - 1);
    }
  }

  onBlur(): void {
    this.focused = false;
    this.add(this.input.nativeElement.value);
    this.onTouched();
  }

  add(value: string): void {
    const tag = value.trim();
    this.input.nativeElement.value = '';

    if (!tag || (!this.allowDuplicates && this.tags.includes(tag))) {
      return;
    }
    this.update([...this.tags, tag]);
  }

  remove(index: number): void {
    if (this.disabled) {
      return;
    }
    this.update(this.tags.filter((_, i) => i !== index));
  }

  focus(): void {
    this.input.nativeElement.focus();
  }

  private update(tags: string[]): void {
    this.tags = tags;
    this.onChange(tags);
  }
}
