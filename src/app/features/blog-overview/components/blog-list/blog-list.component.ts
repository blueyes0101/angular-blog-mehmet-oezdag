import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { BlogPost } from '../../../../core/schemas/blog.schemas';
import { BlogCardComponent } from '../blog-card/blog-card.component';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    BlogCardComponent,
  ],
})
export class BlogListComponent {
  // Input signals
  posts = input<BlogPost[]>([]);
  isLoading = input<boolean>(false);
  hasFilters = input<boolean>(false);
  
  // Output signals
  likeBlog = output<{ id: number; likedByMe: boolean }>();

  trackByPost(index: number, post: BlogPost): number {
    return post.id;
  }
}
