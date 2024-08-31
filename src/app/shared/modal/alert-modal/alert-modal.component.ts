import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatIconModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.scss'
})

export class AlertModalComponent {
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private ICON_STYLES:any = {
    SUCCESS: {
      icon: "success",
      styleClass: "success"
    },
    ERROR: {
      icon: "error",
      styleClass: "error"
    },
    WARNING: {
      icon: "warning",
      styleClass: "warning"
    },
  }

  myIcon = this.ICON_STYLES[this.data.mode]

  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    // Note that we provide the icon here as a string literal here due to a limitation in
    // Stackblitz. If you want to provide the icon from a URL, you can use:
    // `iconRegistry.addSvgIcon('thumbs-up', sanitizer.bypassSecurityTrustResourceUrl('icon.svg'));`
    // iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml(THUMBUP_ICON));
    iconRegistry.addSvgIcon(this.myIcon.icon, sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/svg/${this.myIcon.icon}.svg`))
  }
}
