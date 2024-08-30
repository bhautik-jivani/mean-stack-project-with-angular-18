import { Routes } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostsComponent } from './posts/posts.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';

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
                component: PostListComponent,
            },
            {
                path: 'create',
                component: PostCreateComponent,
                canActivate: [AuthGuard]
            },
            {
                path: ':postId',
                component: PostDetailComponent,
            },
            {
                path: 'edit/:postId',
                component: PostCreateComponent,
                canActivate: [AuthGuard],
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
];
