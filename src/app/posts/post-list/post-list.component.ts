import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { PostsService } from '../posts.service';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [MatExpansionModule, MatButton, RouterLink, MatPaginatorModule, NgOptimizedImage],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit {
  private postsService = inject(PostsService)
  private destroyRef = inject(DestroyRef)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private authService = inject(AuthService)

  isButtonDisabled = signal(false)
  
  posts = this.postsService.fechedPosts
  pageSizeOptions = this.postsService.pageSizeOptions
  totalPosts = this.postsService.totalPosts
  postsPerPage = this.postsService.postsPerPage
  currentPage = this.postsService.currentPage
  isAuthenticated = this.authService.token

  ngOnInit(): void {
    const routeSubscription = this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        const pagesize = +params['pagesize']
        const currentPage = +params['page']

        if(pagesize && currentPage) {
          this.postsService.updatePaginator(pagesize, currentPage)
        } else {
          this.postsService.updatePaginator(this.postsPerPage(), 1)
        }

        const subscription = this.postsService.getPosts(this.postsPerPage(), this.currentPage()).subscribe()
        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe()
        })
      },
    })
    this.destroyRef.onDestroy(() => {
      routeSubscription.unsubscribe
    })
  }

  onChangedPage(pageData: PageEvent) {
    const pagesize = pageData.pageSize
    const currentPage = pageData.pageIndex + 1

    this.postsService.updatePaginator(pagesize, currentPage)
    this.router.navigate(["/"], { queryParams: { pagesize: this.postsPerPage(), page: this.currentPage() }  } )
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
