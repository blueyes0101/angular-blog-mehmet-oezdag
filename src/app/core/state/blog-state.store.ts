import { Injectable, signal, computed } from '@angular/core';
import { BlogPost } from '../schemas/blog.schemas';

// State interface
export interface BlogState {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  categories: string[];
  selectedCategory: string;
  showOnlyFeatured: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: BlogState = {
  posts: [],
  selectedPost: null,
  categories: [],
  selectedCategory: '',
  showOnlyFeatured: false,
  isLoading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class BlogStateStore {
  // Private state signal
  private readonly state = signal<BlogState>(initialState);

  // Computed signals for reading state
  readonly posts = computed(() => this.state().posts);
  readonly selectedPost = computed(() => this.state().selectedPost);
  readonly categories = computed(() => this.state().categories);
  readonly selectedCategory = computed(() => this.state().selectedCategory);
  readonly showOnlyFeatured = computed(() => this.state().showOnlyFeatured);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  // Filtered posts based on current filters
  readonly filteredPosts = computed(() => {
    const state = this.state();
    let filtered = state.posts;

    if (state.selectedCategory) {
      filtered = filtered.filter((post) => post.category === state.selectedCategory);
    }

    if (state.showOnlyFeatured) {
      filtered = filtered.filter((post) => post.featured);
    }

    return filtered;
  });

  // State update methods
  setPosts(posts: BlogPost[]): void {
    this.state.update((state) => ({ ...state, posts }));
  }

  setSelectedPost(post: BlogPost | null): void {
    this.state.update((state) => ({ ...state, selectedPost: post }));
  }

  setCategories(categories: string[]): void {
    this.state.update((state) => ({ ...state, categories }));
  }

  setSelectedCategory(category: string): void {
    this.state.update((state) => ({ ...state, selectedCategory: category }));
  }

  setShowOnlyFeatured(showOnlyFeatured: boolean): void {
    this.state.update((state) => ({ ...state, showOnlyFeatured }));
  }

  setLoading(isLoading: boolean): void {
    this.state.update((state) => ({ ...state, isLoading }));
  }

  setError(error: string | null): void {
    this.state.update((state) => ({ ...state, error }));
  }

  // Action to toggle like on a post
  toggleLikePost(postId: number, likedByMe: boolean): void {
    this.state.update((state) => ({
      ...state,
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByMe,
              likes: likedByMe ? (post.likes || 0) + 1 : Math.max((post.likes || 0) - 1, 0),
            }
          : post,
      ),
    }));
  }

  // Reset filters
  resetFilters(): void {
    this.state.update((state) => ({
      ...state,
      selectedCategory: '',
      showOnlyFeatured: false,
    }));
  }

  // Clear error
  clearError(): void {
    this.state.update((state) => ({ ...state, error: null }));
  }
}
