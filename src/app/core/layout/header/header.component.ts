import { Component, output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { hasRole } from '../../guards/is-authenticated.guard';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class HeaderComponent {
  // Output signals
  toggleSidebar = output<void>();
  toggleDarkMode = output<void>();

  private router = inject(Router);
  private oidc = inject(OidcSecurityService);

  // Authentication observables
  isAuthenticated$ = this.oidc.isAuthenticated$;
  user$ = this.oidc.userData$;
  hasRole = hasRole;

  username$ = this.oidc.userData$.pipe(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map(
      ({ userData }: { userData: any }) =>
        userData?.preferred_username || userData?.name || userData?.email || 'User',
    ),
  );

  // Navigation items for desktop
  readonly navigationItems = [
    { label: 'Blog', route: '/blog', requiresAuth: false },
    { label: 'Neuer Post', route: '/add-blog-page', requiresAuth: true, requiresRole: 'user' },
    { label: 'Kategorien', route: '/categories', requiresAuth: false },
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
      );
    }

    return this.isAuthenticated$.pipe(
      map(({ isAuthenticated }: { isAuthenticated: boolean }) => isAuthenticated),
    );
  }
}
