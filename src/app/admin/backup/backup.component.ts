import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth-service";
import {BackupService} from "../../shared/services/backup.service";

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent {

  exportedData: any;
  exportText: string = 'No export to show';
  exportButtonText: string = 'Do export';

  constructor(private router: Router,
              private authService: AuthService,
              private backupService: BackupService) {
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/home']);
  }

  export() {
    this.backupService.export().subscribe(data => {
      if (data) {
        this.exportedData = data;
        this.exportText = 'Exported data are ready to download!';
        this.exportButtonText = 'Download';
      }
    })
  }

  downloadFile() {
    const blob = new Blob([JSON.stringify(this.exportedData)], { type: 'application/json' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'backup.json';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
