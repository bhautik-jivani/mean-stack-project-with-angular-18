import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../auth/auth.service';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {
  private postsService = inject(PostsService)
  private authService = inject(AuthService)
  private destroyRef = inject(DestroyRef)
  private activatedRoute = inject(ActivatedRoute)

  isButtonDisabled = signal(false)

  postId = input.required<string>()
  isAuthenticated = this.authService.token
  post = signal<Post>({ id: '', title: '', content: '', imagePath: '', creator: '' })
  currentPage = this.postsService.currentPage
  postsPerPage = this.postsService.postsPerPage
  userId = this.authService.userId

  ngOnInit(): void {
    const routerSubscription = this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        const pagesize = params['pagesize']
        const currentPage = params['page']

        if(pagesize && currentPage) {
          this.postsService.updatePaginator(pagesize, currentPage)
        } else {
          this.postsService.updatePaginator(this.postsPerPage(), 1)
        }
        const subscription = this.postsService.getPost(this.postId(), this.userId(), this.postsPerPage(), this.currentPage()).subscribe({
          next: (resp) => {
            this.post.set(resp.post)
          }
        })
        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe()
        })
      }
    })

    this.destroyRef.onDestroy(() => {
      routerSubscription.unsubscribe()
    })
  }

  onDelete(postId: string) {
    this.isButtonDisabled.set(true)
    const subscription = this.postsService.deletePost(postId).subscribe({
      error: () => {
        this.isButtonDisabled.set(false)
      },
      complete: () => {
        this.isButtonDisabled.set(false)
      }
    })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    })
  }
}
