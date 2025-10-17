import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';
import { AuthStore } from '../auth/auth.store';
import { LanguageService } from '../services/language.service';

/**
 * Sidebar Component with Modern Signal-Based Authentication
 *
 * This component uses the centralized AuthStore for reactive authentication state
 * instead of directly injecting OidcSecurityService. This provides better
 * separation of concerns and cleaner component logic.
 */
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
    MatTooltipModule,
    LanguageSwitcherComponent,
    MatDividerModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private languageService = inject(LanguageService);
  readonly authStore = inject(AuthStore);

  // Responsive breakpoint
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
    takeUntilDestroyed(),
  );

  // Authentication state from AuthStore (using Signals)
  isAuthenticated = this.authStore.isAuthenticated;
  userData = this.authStore.userData;
  username = this.authStore.username;
  initials = this.authStore.initials;
  roles = this.authStore.roles;

  // Computed property to check if user can add blog posts
  canAddBlog = computed(() => {
    return this.isAuthenticated() && this.authStore.hasRole('user');
  });

  // Navigation items
  readonly navigationItems = [
    { label: 'Overview', route: '/overview', icon: 'dashboard', requiresAuth: false },
    { label: 'Blog', route: '/blog', icon: 'article', requiresAuth: false },
    { label: 'Kategorien', route: '/categories', icon: 'category', requiresAuth: false },
  ];

  /**
   * Trigger login flow
   */
  login(): void {
    this.authStore.login();
  }

  /**
   * Trigger logout flow
   */
  logout(): void {
    this.authStore.logout();
  }

  /**
   * Navigate to add blog page (protected route)
   * Uses current language prefix for proper routing
   */
  goToAddBlog(): void {
    const currentLang = this.languageService.getCurrentLanguage();
    this.router.navigate([currentLang, 'add-blog-page']);
    console.log('[Sidebar] Navigating to add-blog-page with language:', currentLang);
  }

  /**
   * Toggle dark mode theme
   */
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
