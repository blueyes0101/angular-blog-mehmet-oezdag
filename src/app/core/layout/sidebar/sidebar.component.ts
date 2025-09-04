import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface NavigationItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
})
export class SidebarComponent {
  // Input signals
  isOpen = input<boolean>(false);

  // Output signals
  closeSidebar = output<void>();

  // Navigation items
  readonly navigationItems: NavigationItem[] = [
    { icon: 'home', label: 'Startseite', route: '/' },
    { icon: 'article', label: 'Blog Übersicht', route: '/blog' },
    { icon: 'create', label: 'Neuer Blog-Post', route: '/add-blog' },
    { icon: 'category', label: 'Kategorien', route: '/categories' },
    { icon: 'star', label: 'Featured Posts', route: '/featured' },
  ];

  readonly secondaryItems: NavigationItem[] = [
    { icon: 'person', label: 'Profil', route: '/profile' },
    { icon: 'settings', label: 'Einstellungen', route: '/settings' },
    { icon: 'help', label: 'Hilfe', route: '/help' },
  ];

  /**
   * Handles navigation item click
   */
  onNavigate(): void {
    this.closeSidebar.emit();
  }
}
