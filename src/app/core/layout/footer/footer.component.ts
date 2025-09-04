import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  readonly socialLinks = [
    { icon: 'link', url: 'https://github.com', label: 'GitHub' },
    { icon: 'work', url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'alternate_email', url: 'https://twitter.com', label: 'Twitter' },
  ];
}
