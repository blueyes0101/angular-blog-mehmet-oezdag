// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { AddBlogPageComponent } from './components/add-blog-page/add-blog-page.component';
// import { isAuthenticatedGuard } from '../../core/guards/is-authenticated.guard';

// const routes: Routes = [
//   {
//     path: '',
//     component: AddBlogPageComponent,
//     canActivate: [isAuthenticatedGuard],
//     data: { role: 'user' },
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class AddBlogPageRoutingModule {}

import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-blog-page',
  standalone: true,
  template: `
    <h1>Add Blog Post</h1>
    <p>Form implementation is out of scope for this sprint.</p>
  `,
})
export class AddBlogPageComponent {}

export const ADD_BLOG_ROUTES: Routes = [{ path: '', component: AddBlogPageComponent }];
