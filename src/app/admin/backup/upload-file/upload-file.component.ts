import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {UntypedFormBuilder} from "@angular/forms";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {

  @Input() delete = false;
  @Output() submitFile = new EventEmitter<File>();

  editForm = this.fb.group({
    file: []
  });
  fileName = '';

  constructor(private fb: UntypedFormBuilder) { }

  setFileData(event: Event): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.editForm.get('file')?.setValue(file);
        this.fileName = file.name;
        this.submitFile.emit(file);
      });
      reader.readAsDataURL(file);
    }
  }
}
