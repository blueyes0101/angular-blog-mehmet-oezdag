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
    path: 'add-blog-page',
    loadChildren: () =>
      import('./features/add-blog-page/add-blog-page.module').then((m) => m.AddBlogPageModule),
    canActivate: [isAuthenticatedGuard],
    data: { role: 'user' },
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth-panel/auth-panel.routes').then((m) => m.AUTH_ROUTES),
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
