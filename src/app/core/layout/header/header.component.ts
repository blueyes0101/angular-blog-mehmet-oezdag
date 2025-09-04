import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

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

  // Navigation items for desktop
  readonly navigationItems = [
    { label: 'Blog', route: '/blog' },
    { label: 'Neuer Post', route: '/add-blog' },
    { label: 'Kategorien', route: '/categories' },
  ];
}
