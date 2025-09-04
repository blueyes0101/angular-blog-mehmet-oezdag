import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
})
export class BlogCardComponent {
  // Input signals
  post = input.required<BlogPost>();
  index = input<number>(0);
  isFirst = input<boolean>(false);
  isLast = input<boolean>(false);
  isEven = input<boolean>(false);
  
  // Output signals
  likeBlog = output<{ id: number; likedByMe: boolean }>();

  constructor(private router: Router) {}

  /**
   * Navigate to blog detail page
   */
  onReadMore(): void {
    this.router.navigate(['/blog-detail', this.post().id]);
  }
  
  /**
   * Handle like button click
   */
  onLikeClick(): void {
    const post = this.post();
    this.likeBlog.emit({ id: post.id, likedByMe: !post.likedByMe });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Get preview content
   */
  getPreviewContent(content: string, maxLength = 150): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  /**
   * Get category color
   */
  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      Angular: 'primary',
      CSS: 'accent',
      TypeScript: 'warn',
      Azure: 'primary',
    };
    return colors[category] || 'primary';
  }
}
