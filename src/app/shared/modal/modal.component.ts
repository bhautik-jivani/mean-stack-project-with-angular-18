import { AfterContentInit, Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { ModalService, Modal } from '../modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements AfterContentInit {
  readonly dialog = inject(MatDialog);
  message = input<Modal>()
  private modalService = inject(ModalService);

  ngAfterContentInit(): void {
    const dialogRef = this.dialog.open(AlertModalComponent, {
      disableClose: true,
      panelClass: this.message()?.mode === "SUCCESS" ? "alert-success" : this.message()?.mode === "ERROR" ? "alert-error" : this.message()?.mode === "WARNING" ? "alert-warning" : "",
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: this.message()?.title,
        message: this.message()?.message
      }
    })

    dialogRef.afterClosed().subscribe(() => {
      this.modalService.clearMessage();
    })
  }
  // openDialog(): void {
  //   this.dialog.open(ErrorModalComponent, {
  //     data: {
  //       title: this.title(),
  //       message: this.message()
  //     }
  //   })
  // }
}
