import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './core/guards/is-authenticated.guard';

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
      import('./features/add-blog-page/add-blog-page.module').then((m) => m.AddBlogPageModule),
    // canActivate: [isAuthenticatedGuard], // Temporarily disabled for testing
    // data: { role: 'user' },
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./core/static/unauthorized/unauthorized.component').then(
        (c) => c.UnauthorizedComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '/blog',
  },
];
