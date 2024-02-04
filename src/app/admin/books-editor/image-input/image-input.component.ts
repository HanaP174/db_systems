import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {UntypedFormBuilder} from "@angular/forms";

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.css']
})
export class ImageInputComponent implements OnChanges {

  @Input() image = '';
  @Output() submitImage = new EventEmitter<string>();

  editForm = this.fb.group({
    photo: this.image != null ? this.image : []
  });

  constructor(private fb: UntypedFormBuilder) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['image']) {
      this.editForm = this.fb.group({
        photo: this.image != null ? this.image : []
      });
    }
  }

  setFileData(event: Event): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.editForm.get('photo')?.setValue(reader.result as string);
        this.submitImage.emit(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  }
}
