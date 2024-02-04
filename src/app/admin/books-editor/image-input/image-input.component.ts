import {Component, EventEmitter, Output} from '@angular/core';
import {UntypedFormBuilder} from "@angular/forms";

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.css']
})
export class ImageInputComponent {

  @Output() image = new EventEmitter<string>();

  editForm = this.fb.group({
    photo: []
  });

  constructor(private fb: UntypedFormBuilder) { }

  setFileData(event: Event): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.editForm.get('photo')?.setValue(reader.result as string);
        this.image.emit(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  }
}
