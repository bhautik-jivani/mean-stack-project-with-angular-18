import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
  })
  export class PostsComponent {

  }