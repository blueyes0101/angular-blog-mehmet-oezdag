import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { hasRole } from '../../helpers/auth.helpers';

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

  // Authentication observables
  isAuthenticated$ = this.oidcSecurityService.isAuthenticated$.pipe(
    map(({ isAuthenticated }) => isAuthenticated)
  );
  
  userData$ = this.oidcSecurityService.userData$;
  
  hasUserRole$ = this.oidcSecurityService.userData$.pipe(
    map(userData => hasRole(userData, 'user'))
  );

  username$ = this.oidcSecurityService.userData$.pipe(
    map(userData => userData?.preferred_username || userData?.name || userData?.email || 'User')
  );

  // Navigation items for desktop
  readonly navigationItems = [
    { label: 'Blog', route: '/blog', requiresAuth: false },
    { label: 'Neuer Post', route: '/add-blog', requiresAuth: true, requiresRole: 'user' },
    { label: 'Add Blog Page', route: '/add-blog-page', requiresAuth: true, requiresRole: 'user' },
    { label: 'Kategorien', route: '/categories', requiresAuth: false },
  ];

  constructor(private oidcSecurityService: OidcSecurityService) {}

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.logoff().subscribe();
  }

  shouldShowNavItem(item: any): Observable<boolean> {
    if (!item.requiresAuth) {
      return this.isAuthenticated$.pipe(map(() => true));
    }

    if (item.requiresRole) {
      return this.oidcSecurityService.userData$.pipe(
        map(userData => hasRole(userData, item.requiresRole))
      );
    }

    return this.isAuthenticated$;
  }
}
