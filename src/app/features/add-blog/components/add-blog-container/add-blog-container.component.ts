import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogStateStore } from '../../../../core/state/blog-state.store';
import { BlogPost } from '../../../../core/schemas/blog.schemas';
import { AddBlogFormComponent } from '../add-blog-form/add-blog-form.component';

@Component({
  selector: 'app-add-blog-container',
  templateUrl: './add-blog-container.component.html',
  styleUrls: ['./add-blog-container.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AddBlogFormComponent],
})
export class AddBlogContainerComponent {
  private readonly blogService = inject(BlogService);
  private readonly blogState = inject(BlogStateStore);
  private readonly router = inject(Router);

  // Local state signals
  readonly isSaving = signal(false);
  readonly saveError = signal<string | null>(null);

  /**
   * Handles form submission
   */
  onSubmitBlog(blogData: Partial<BlogPost>): void {
    this.isSaving.set(true);
    this.saveError.set(null);

    // Create the blog post
    const newPost: Omit<BlogPost, 'id'> = {
      title: blogData.title || '',
      content: blogData.content || '',
      author: blogData.author || '',
      category: blogData.category || '',
      tags: blogData.tags || [],
      featured: blogData.featured || false,
      imageUrl: blogData.imageUrl || '',
      publishDate: new Date().toISOString().split('T')[0],
      likedByMe: false,
      likes: 0,
    };

    // In a real app, this would be an API call
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      try {
        // Create a mock post with ID
        const createdPost: BlogPost = {
          ...newPost,
          id: Math.floor(Math.random() * 10000) + 100,
        };

        // Update state
        const currentPosts = this.blogState.posts();
        this.blogState.setPosts([createdPost, ...currentPosts]);

        // Navigate to blog overview
        this.router.navigate(['/blog']);
      } catch (error) {
        console.error('Error creating blog post:', error);
        this.saveError.set('Fehler beim Erstellen des Blog-Posts');
      } finally {
        this.isSaving.set(false);
      }
    }, 1000);
  }

  /**
   * Handles cancel action
   */
  onCancel(): void {
    this.router.navigate(['/blog']);
  }
}
