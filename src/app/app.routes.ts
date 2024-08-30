import { Routes } from '@angular/router';

// import { SignupComponent } from './auth/signup/signup.component';
// import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

// import { PostListComponent } from './posts/post-list/post-list.component';
// import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostsComponent } from './posts/posts.component';
// import { PostDetailComponent } from './posts/post-detail/post-detail.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
    },
    {
        path: 'posts',
        component: PostsComponent,
        children: [
            {
                path: '',
                // component: PostListComponent,
                loadComponent: () => import("./posts/post-list/post-list.component").then((mod) => mod.PostListComponent),
            },
            {
                path: 'create',
                // component: PostCreateComponent,
                loadComponent: () => import("./posts/post-create/post-create.component").then((mod) => mod.PostCreateComponent),
                canActivate: [AuthGuard]
            },
            {
                path: ':postId',
                // component: PostDetailComponent,
                loadComponent: () => import("./posts/post-detail/post-detail.component").then((mod) => mod.PostDetailComponent),
            },
            {
                path: 'edit/:postId',
                // component: PostCreateComponent,
                loadComponent: () => import("./posts/post-create/post-create.component").then((mod) => mod.PostCreateComponent),
                canActivate: [AuthGuard],
            },
        ]
    },
    {
        path: 'login',
        // component: LoginComponent,
        loadComponent: () => import("./auth/login/login.component").then((mod) => mod.LoginComponent),
    },
    {
        path: 'signup',
        // component: SignupComponent,
        loadComponent: () => import("./auth/signup/signup.component").then((mod) => mod.SignupComponent),
    },
];
