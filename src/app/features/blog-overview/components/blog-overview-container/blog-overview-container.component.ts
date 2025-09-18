import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogStateStore } from '../../../../core/state/blog-state.store';
import { BlogFilterComponent } from '../blog-filter/blog-filter.component';
import { BlogListComponent } from '../blog-list/blog-list.component';

@Component({
  selector: 'app-blog-overview-container',
  templateUrl: './blog-overview-container.component.html',
  styleUrls: ['./blog-overview-container.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, BlogFilterComponent, BlogListComponent],
})
export class BlogOverviewContainerComponent implements OnInit {
  // Inject services
  private readonly blogService = inject(BlogService);
  private readonly blogState = inject(BlogStateStore);

  // State signals
  readonly posts = this.blogState.filteredPosts;
  readonly categories = this.blogState.categories;
  readonly selectedCategory = this.blogState.selectedCategory;
  readonly showOnlyFeatured = this.blogState.showOnlyFeatured;
  readonly isLoading = this.blogState.isLoading;
  readonly error = this.blogState.error;

  constructor() {}

  ngOnInit(): void {
    // Load initial data
    this.loadBlogData();
  }

  /**
   * Loads blog data from the service
   */
  private loadBlogData(): void {
    this.blogState.setLoading(true);

    // Load posts and categories
    combineLatest([this.blogService.getPosts(), this.blogService.getCategories()])
      .pipe(finalize(() => this.blogState.setLoading(false)))
      .subscribe({
        next: ([posts, categories]) => {
          this.blogState.setPosts(posts);
          this.blogState.setCategories(categories);
          this.blogState.clearError();
        },
        error: (error) => {
          console.error('Error loading blog data:', error);
          this.blogState.setError('Fehler beim Laden der Blog-Daten');
        },
      });
  }

  /**
   * Updates the selected category
   */
  onCategoryChange(category: string): void {
    this.blogState.setSelectedCategory(category);
  }

  /**
   * Toggles featured posts filter
   */
  onToggleFeatured(): void {
    this.blogState.setShowOnlyFeatured(!this.showOnlyFeatured());
  }

  /**
   * Resets all filters
   */
  onResetFilters(): void {
    this.blogState.resetFilters();
  }

  /**
   * Handles refresh request
   */
  onRefresh(): void {
    this.loadBlogData();
  }

  /**
   * Handles like event from blog card
   */
  onLikeBlog(event: { id: number; likedByMe: boolean }): void {
    this.blogState.toggleLikePost(event.id, event.likedByMe);
    // In a real app, you would also make an API call here
  }
}
