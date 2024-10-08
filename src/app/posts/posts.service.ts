import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, map, tap, throwError } from "rxjs";

import { Post } from "./post.model";
import { ModalService } from "../shared/modal.service";
import { LoaderService } from "../shared/loader.service";
import { environment } from "../../environments/environment";

const BASE_URL = environment.apiUrl
@Injectable({ providedIn: 'root' })
export class PostsService {
    private http = inject(HttpClient)
    private modalService = inject(ModalService)
    private loaderService = inject(LoaderService)
    private router = inject(Router)
    private activatedRoute = inject(ActivatedRoute)
    private _posts= signal<{posts: Post[], postCount: number, currentPage: number}>({ posts: [], postCount: 0, currentPage: 1})
    
    private _pageSizeOptions = signal<[number, number, number]>([2, 5, 10])
    private _totalPosts = signal<number>(this._posts().postCount)
    private _postsPerPage = signal<number>(this._pageSizeOptions()[0])
    private _currentPage = signal<number>(this._posts().currentPage)

    // private posts= signal<Post[]>([
    //     {
    //         title: 'First Post',
    //         content: "This is the first posts\'s conent"
    //     },
    //     {
    //         title: 'Second Post',
    //         content: "This is the second posts\'s conent"
    //     },
    //     {
    //         title: 'Third Post',
    //         content: "This is the third posts\'s conent"
    //     },
    // ])

    fechedPosts = this._posts.asReadonly()
    
    pageSizeOptions = this._pageSizeOptions.asReadonly()
    totalPosts = this._totalPosts.asReadonly()
    postsPerPage = this._postsPerPage.asReadonly()
    currentPage = this._currentPage.asReadonly()

    updatePaginator(postsPerPage: number, currentPage: number) {
        this._postsPerPage.set(postsPerPage)
        this._currentPage.set(currentPage)
    }
    

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
        this.loaderService.showLoader()
        return this.http.get<{ message: string, posts: any, maxPosts: number, currentPage: number }>(`${BASE_URL}/posts`, {
            params: { pagesize: postsPerPage, page: currentPage }
        }).pipe(
            map((postData) => {
                return { 
                    posts: postData.posts.map((post: any) => {
                        return {
                            id: post._id,
                            title: post.title,
                            content: post.content,
                            imagePath: post.imagePath,
                            creator: post.creator
                        }
                    }),
                    maxPosts: postData.maxPosts,
                    currentPage: postData.currentPage,
                }
            }),
            tap({
                next: (transformedPostData) => {
                    this.loaderService.hideLoader()
                    this._posts.set({ posts: transformedPostData.posts, postCount: transformedPostData.maxPosts, currentPage: transformedPostData.currentPage})
                    this._totalPosts.set(this._posts().postCount)
                    this._currentPage.set(this._posts().currentPage)
                }
            })
        )
    }

    getPost(postId: string, userId: string, pagesize: number, currentpage: number, isEditPage: boolean = false) {
        this.loaderService.showLoader()
        return this.http.get<{ message: string, post: any }>(`${BASE_URL}/posts/` + postId, {
            params: { pagesize: pagesize, currentpage: currentpage}
        }).pipe(
            catchError((error) => {
                this.router.navigate(["/"], {
                    relativeTo: this.activatedRoute,
                    queryParams: { pagesize: pagesize, page: currentpage }
                })
                return throwError(() => new Error(error))
            }),
            tap({
                next: (postData) => {
                    this.loaderService.hideLoader()
                    if(postData.post.creator !== userId && isEditPage) {
                        this.router.navigate(["/posts", postId], { queryParams: {  pagesize: this.postsPerPage(), page: this.currentPage() }})
                    }
                    return {
                        id: postData.post._id,
                        title: postData.post.title,
                        content: postData.post.content,
                        imagePath: postData.post.imagePath,
                        creator: postData.post.creator,
                    }
                }
            })
        )
    }

    addPost(postObj: any) {
        this.loaderService.showLoader()
        const postData = new FormData()
        postData.append("title", postObj.title)
        postData.append("content", postObj.content)
        postData.append("image", postObj.image)
        postData.append("creator", postObj.creator)
        
        return this.http.post<{ message: string, post: Post }>(`${BASE_URL}/posts`, postData).pipe(
            tap({
                complete: () => {
                    const messages = {
                        title: "Success",
                        message: "Post created successfully.",
                        mode: "SUCCESS"
                    }
                    this.loaderService.hideLoader()
                    this.modalService.showMessage(messages)
                }
            })
        )
    }

    updatePost(postId: string, postObj: any, pagesize: number, currentpage: number) {
        this.loaderService.showLoader()
        let updatedPostData: Post | FormData
        
        if (typeof postObj.image === "object") {
            updatedPostData = new FormData()
            updatedPostData.append("id", postId)
            updatedPostData.append("title", postObj.title)
            updatedPostData.append("content", postObj.content)
            updatedPostData.append("image", postObj.image)
            updatedPostData.append("creator", postObj.creator)
        } else {
            updatedPostData = {...postObj, id: postId}
        }
        
        return this.http.put<{message: string, post: Post}>(`${BASE_URL}/posts/` + postId, updatedPostData).pipe(
            tap({
                complete: () => {
                    const messages = {
                        title: "Success",
                        message: "Post updated successfully.",
                        mode: "SUCCESS"
                    }
                    this.loaderService.hideLoader()
                    this.modalService.showMessage(messages)

                    this.router.navigate(["/"], {
                      relativeTo: this.activatedRoute,
                      queryParams: { pagesize: pagesize, page: currentpage }
                    })
                }
            })
        )
    }

    deletePost(postId: string) {
        this.loaderService.showLoader()
        return this.http.delete<{ message: string }>(`${BASE_URL}/posts/` + postId).pipe(
            tap({
                complete: () => {
                    const messages = {
                        title: "Success",
                        message: "Post deleted successfully.",
                        mode: "SUCCESS"
                    }
                    this.loaderService.hideLoader()
                    this.modalService.showMessage(messages)

                    if (this.totalPosts() <= (this.postsPerPage() * this.currentPage() - 1)) {
                        const pagesize = this.postsPerPage()
                        const currentPage = this.currentPage() - 1
                        this.updatePaginator(pagesize, currentPage)
                        this.router.navigate(["/"], {queryParams: {pagesize: pagesize, page: currentPage}})
                    } else {
                        const pagesize = this.postsPerPage()
                        const currentPage = this.currentPage() 
                        this.getPosts(pagesize, currentPage).subscribe()
                    }
                }
            }),
        )
    }

}