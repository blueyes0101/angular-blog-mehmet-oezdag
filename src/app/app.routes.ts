import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/blog',
    pathMatch: 'full',
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./features/blog-overview/blog-overview.module').then((m) => m.BlogOverviewModule),
  },
  {
    path: 'blog-detail',
    loadChildren: () =>
      import('./features/blog-detail/blog-detail.module').then((m) => m.BlogDetailModule),
  },
  {
    path: 'add-blog',
    loadChildren: () =>
      import('./features/add-blog/add-blog.module').then((m) => m.AddBlogModule),
  },
  {
    path: '**',
    redirectTo: '/blog',
  },
];
