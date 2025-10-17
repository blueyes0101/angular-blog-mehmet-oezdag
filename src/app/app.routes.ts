import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { langGuard } from './core/guards/lang.guard';

/**
 * Application Routes Configuration
 *
 * Route Structure:
 * - Language-prefixed routes (:lang/...)
 * - Protected routes use authGuard with optional role data
 * - Lazy-loaded modules for performance optimization
 */
export const routes: Routes = [
  // Redirect root to default language (en)
  {
    path: '',
    redirectTo: '/en',
    pathMatch: 'full',
  },
  // Language-prefixed routes
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      {
        path: '',
        redirectTo: 'blog',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        redirectTo: 'blog',
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
        loadComponent: () =>
          import('./features/add-blog-page/components/add-blog-page/add-blog-page.component').then(
            (m) => m.AddBlogPageComponent,
          ),
        // Protected route: requires authentication AND 'user' role
        canActivate: [authGuard],
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
    ],
  },
  // Catch-all: redirect invalid routes to default language
  {
    path: '**',
    redirectTo: '/en/blog',
  },
];
