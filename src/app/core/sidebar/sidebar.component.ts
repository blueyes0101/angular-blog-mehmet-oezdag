import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { hasRole } from '../guards/is-authenticated.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private oidc = inject(OidcSecurityService);

  // Responsive breakpoint
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
    takeUntilDestroyed(),
  );

  // Authentication observables
  isAuthenticated$ = this.oidc.isAuthenticated$.pipe(takeUntilDestroyed());
  user$ = this.oidc.userData$.pipe(takeUntilDestroyed());
  hasRole = hasRole;

  username$ = this.oidc.userData$.pipe(
    map(
      ({ userData }: { userData: unknown }) =>
        (userData as any)?.preferred_username || (userData as any)?.name || (userData as any)?.email || 'User',
    ),
    takeUntilDestroyed(),
  );

  // Navigation items
  readonly navigationItems = [
    { label: 'Overview', route: '/overview', icon: 'dashboard', requiresAuth: false },
    { label: 'Blog', route: '/blog', icon: 'article', requiresAuth: false },
    { label: 'Kategorien', route: '/categories', icon: 'category', requiresAuth: false },
  ];

  login(): void {
    this.oidc.authorize();
  }

  logout(): void {
    this.oidc.logoffAndRevokeTokens().subscribe();
  }

  goToAddBlog(): void {
    this.router.navigateByUrl('/add-blog-page');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shouldShowNavItem(item: any): Observable<boolean> {
    if (!item.requiresAuth) {
      return this.isAuthenticated$.pipe(map(() => true));
    }

    if (item.requiresRole) {
      return this.oidc.userData$.pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map(({ userData }: { userData: any }) => hasRole(userData, item.requiresRole)),
        takeUntilDestroyed(),
      );
    }

    return this.isAuthenticated$.pipe(
      map(({ isAuthenticated }: { isAuthenticated: boolean }) => isAuthenticated),
      takeUntilDestroyed(),
    );
  }

  toggleDarkMode(): void {
    const isDarkMode = document.body.classList.contains('dark-theme');
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkMode', 'false');
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('darkMode', 'true');
    }
  }
}
