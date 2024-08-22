import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatCard } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { mimeType } from './mime-type.validator';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [ReactiveFormsModule, MatCard, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})

export class PostCreateComponent implements OnInit {
  private postsService = inject(PostsService)
  private destroyRef = inject(DestroyRef)
  private activatedRoute = inject(ActivatedRoute)

  postId = input.required<string>()
  isButtonDisabled = signal(false)
  imagePreview = signal<string>('')
  postsPerPage = this.postsService.postsPerPage
  currentPage = this.postsService.currentPage

  postForm = new FormGroup({
    title: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl("", { nonNullable: true, validators: [Validators.required] }),
    image: new FormControl<File | string>("", { nonNullable: true, validators: [Validators.required], asyncValidators: [mimeType] }),
  })

  get titleIsValid() {
    // return this.postForm.controls.title.touched && this.postForm.controls.title.dirty && this.postForm.controls.title.invalid
    return this.postForm.controls.title.invalid
  }
  
  get contentIsValid() {
    // return this.postForm.controls.content.touched && this.postForm.controls.content.dirty && this.postForm.controls.content.invalid
    return this.postForm.controls.content.invalid
  }
  
  ngOnInit(): void {  
    if(this.postId()) {
      const routeSubscription = this.activatedRoute.queryParams.subscribe({
        next: (params) => {
          const pagesize = +params['pagesize']
          const currentPage = +params['page']
  
          if(pagesize && currentPage) {
            this.postsService.updatePaginator(pagesize, currentPage)
          } else {
            this.postsService.updatePaginator(this.postsPerPage(), 1)
          }
          const subscription = this.postsService.getPost(this.postId(), this.postsPerPage(), this.currentPage()).subscribe({
            next: (resp) => {
              this.postForm.patchValue({
                title: resp.post.title, 
                content: resp.post.content,
                image: resp.post.imagePath,
              })
              this.imagePreview.set(resp.post.imagePath)
            }
          })
          this.destroyRef.onDestroy(() => {
            subscription.unsubscribe()
          })
        },
      })
      this.destroyRef.onDestroy(() => {
        routeSubscription.unsubscribe
      })
    }
  }

  onImagePicked(event: any) {
    event.preventDefault()
    
    if(event) {
      const fileObj = (event.target as HTMLInputElement).files
      if(fileObj && fileObj.length) {
        const file = fileObj[0];
        
        this.postForm.patchValue({ image: file })
        this.postForm.get('image')?.updateValueAndValidity()
  
        const reader = new FileReader()
        reader.onload = () => {
          this.imagePreview.set(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  onAddPost(formDirective: FormGroupDirective) {
    if(this.postForm.invalid) {
      return
    }

    this.isButtonDisabled.set(true)
    
    const postData = {title: this.postForm.value.title ?? '', content: this.postForm.value.content ?? '', image: this.postForm.value.image ?? ''}

    if (this.postId()) {
      const subscription = this.postsService.updatePost(this.postId(), postData, this.postsPerPage(), this.currentPage()).subscribe({
        error: (error) => {
          this.isButtonDisabled.set(false)
        },
        complete: () => {
          this.isButtonDisabled.set(false)
        }
      })
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe()
      })
    } else {
      const subscription = this.postsService.addPost(postData).subscribe({
        error: (error) => {
          this.isButtonDisabled.set(false)
        },
        complete: () => {
          this.isButtonDisabled.set(false)
          this.onReset(formDirective)
        }
      })
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe()
      })
    }
  }

  onReset(formDirective: FormGroupDirective) {
    formDirective.resetForm()
    this.postForm.reset()
    this.imagePreview.set("")
  }
}

