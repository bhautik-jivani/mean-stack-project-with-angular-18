import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { ModalService } from './shared/modal.service';
import { ModalComponent } from './shared/modal/modal.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ModalComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mean-stack-project';

  private modalService = inject(ModalService)
  private loaderService = inject(LoaderService)

  message = this.modalService.message
  loader = this.loaderService.loader
}
