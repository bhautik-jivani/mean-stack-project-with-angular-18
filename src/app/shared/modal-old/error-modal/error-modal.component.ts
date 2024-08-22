import { Component, inject, input } from '@angular/core';
import { ModalComponent } from "../modal.component";
import { ErrorService } from '../../modal.service';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-error-modal',
    standalone: true,
    templateUrl: './error-modal.component.html',
    styleUrl: './error-modal.component.scss',
    imports: [ModalComponent, MatButton]
})
export class ErrorModalComponent {
    title = input<string>();
    message = input<string>();
    private errorService = inject(ErrorService);

    onClearError() {
        this.errorService.clearError();
    }
}