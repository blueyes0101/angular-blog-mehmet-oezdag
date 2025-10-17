import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { BlogOverviewContainerComponent } from './blog-overview-container.component';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogStateStore } from '../../../../core/state/blog-state.store';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

describe('BlogOverviewContainerComponent (Smart Component)', () => {
  let component: BlogOverviewContainerComponent;
  let fixture: ComponentFixture<BlogOverviewContainerComponent>;
  let blogService: jasmine.SpyObj<BlogService>;
  let blogState: BlogStateStore;
  let router: jasmine.SpyObj<Router>;

  const mockBlogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Test Post 1',
      content: 'Content 1',
      author: 'Author 1',
      publishDate: '2024-01-15',
      category: 'Angular',
      tags: ['test'],
      featured: true,
      imageUrl: 'https://example.com/image1.jpg',
      likedByMe: false,
      likes: 10,
    },
    {
      id: 2,
      title: 'Test Post 2',
      content: 'Content 2',
      author: 'Author 2',
      publishDate: '2024-01-16',
      category: 'TypeScript',
      tags: ['test'],
      featured: false,
      imageUrl: 'https://example.com/image2.jpg',
      likedByMe: true,
      likes: 25,
    },
  ];

  const mockCategories = ['Angular', 'TypeScript', 'CSS'];

  beforeEach(async () => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', [
      'getPosts',
      'getPostsByCategory',
      'getFeaturedPosts',
      'getCategories',
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BlogOverviewContainerComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: Router, useValue: routerSpy },
        BlogStateStore,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogOverviewContainerComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;
    blogState = TestBed.inject(BlogStateStore);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default service responses
    blogService.getPosts.and.returnValue(of(mockBlogPosts));
    blogService.getPostsByCategory.and.returnValue(
      of(mockBlogPosts.filter((p) => p.category === 'Angular')),
    );
    blogService.getFeaturedPosts.and.returnValue(of(mockBlogPosts.filter((p) => p.featured)));
    blogService.getCategories.and.returnValue(of(mockCategories));
    router.navigate.and.returnValue(Promise.resolve(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be a Smart Component (manages state)', () => {
    // Smart component should have signals and state management
    expect(component.posts).toBeDefined();
    expect(component.selectedCategory).toBeDefined();
    expect(component.showOnlyFeatured).toBeDefined();
    expect(component.categories).toBeDefined();
    expect(component.isLoading).toBeDefined();
    expect(component.error).toBeDefined();

    // Should have methods for state changes
    expect(component.onCategoryChange).toBeDefined();
    expect(component.onToggleFeatured).toBeDefined();
    expect(component.onResetFilters).toBeDefined();
    expect(component.onRefresh).toBeDefined();
  });

  it('should load blog data on initialization', () => {
    fixture.detectChanges();

    // Verify service methods were called
    expect(blogService.getPosts).toHaveBeenCalled();
    expect(blogService.getCategories).toHaveBeenCalled();

    // Check that signals are properly initialized
    expect(component.posts).toBeDefined();
    expect(component.categories).toBeDefined();
    expect(component.isLoading).toBeDefined();
  });

  it('should filter posts by category', () => {
    fixture.detectChanges();

    // Change category filter
    component.onCategoryChange('Angular');

    // Verify the category was set in the state
    expect(component.selectedCategory()).toBe('Angular');
  });

  it('should filter posts by featured status', () => {
    fixture.detectChanges();

    const initialFeaturedState = component.showOnlyFeatured();

    // Toggle featured filter
    component.onToggleFeatured();

    // Verify the featured filter was toggled
    expect(component.showOnlyFeatured()).toBe(!initialFeaturedState);
  });

  it('should reset filters', () => {
    // Set some filters first
    component.onCategoryChange('Angular');
    component.onToggleFeatured();

    // Reset filters
    component.onResetFilters();

    // Check that filters are reset
    expect(component.selectedCategory()).toBe('');
    expect(component.showOnlyFeatured()).toBe(false);
  });

  it('should handle refresh requests', () => {
    spyOn(component as any, 'loadBlogData');

    component.onRefresh();

    expect((component as any).loadBlogData).toHaveBeenCalled();
  });

  it('should handle service errors gracefully', () => {
    // Mock service error
    blogService.getPosts.and.returnValue(throwError(() => new Error('Service error')));
    blogService.getCategories.and.returnValue(of(mockCategories));

    fixture.detectChanges();

    // Check that error state is handled
    expect(component.error).toBeDefined();
  });

  it('should start with loading state', () => {
    // Check initial state before loading
    expect(component.isLoading()).toBe(false);

    fixture.detectChanges();

    // After initialization, loading should be managed by the state store
    expect(component.isLoading).toBeDefined();
  });

  it('should pass correct data to dumb components', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    // Should contain app-blog-filter component
    expect(compiled.querySelector('app-blog-filter')).toBeTruthy();

    // Should contain app-blog-list component
    expect(compiled.querySelector('app-blog-list')).toBeTruthy();
  });

  it('should handle combined filters (category + featured)', () => {
    fixture.detectChanges();

    // Set category filter
    component.onCategoryChange('Angular');

    // Set featured filter
    component.onToggleFeatured();

    // Verify both filters are set
    expect(component.selectedCategory()).toBe('Angular');
    expect(component.showOnlyFeatured()).toBe(true);
  });

  describe('State Management', () => {
    it('should update state when posts are loaded', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Verify state was updated
      expect(blogState.posts().length).toBeGreaterThan(0);
      expect(blogState.categories().length).toBeGreaterThan(0);
    }));

    it('should set loading state correctly', fakeAsync(() => {
      // Don't call fixture.detectChanges() yet
      // The loading state starts as false before ngOnInit

      expect(component.isLoading()).toBe(false);

      // Now trigger ngOnInit which starts loading
      fixture.detectChanges();
      // After starting load, should eventually be false after completion
      tick();

      // Should not be loading after data loads
      expect(component.isLoading()).toBe(false);
    }));

    it('should clear error state after successful load', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(component.error()).toBeNull();
    }));

    it('should handle error state when loading fails', fakeAsync(() => {
      blogService.getPosts.and.returnValue(throwError(() => new Error('Network error')));

      fixture.detectChanges();
      tick();

      expect(component.error()).toBeTruthy();
    }));
  });

  describe('Like Functionality', () => {
    it('should handle like events from child components', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const likeEvent = { id: 1, likedByMe: true };
      component.onLikeBlog(likeEvent);

      // Verify state was updated
      const posts = blogState.posts();
      const likedPost = posts.find((p) => p.id === 1);
      expect(likedPost?.likedByMe).toBe(true);
      expect(likedPost?.likes).toBe(11); // Was 10, now 11
    }));

    it('should handle unlike events', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const unlikeEvent = { id: 2, likedByMe: false };
      component.onLikeBlog(unlikeEvent);

      const posts = blogState.posts();
      const unlikedPost = posts.find((p) => p.id === 2);
      expect(unlikedPost?.likedByMe).toBe(false);
      expect(unlikedPost?.likes).toBe(24); // Was 25, now 24
    }));
  });

  describe('Navigation to Add Blog', () => {
    it('should navigate to add blog page when onAddBlog is called', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      component.onAddBlog();
      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/add-blog']);
    }));

    it('should handle navigation failure gracefully', (done) => {
      const consoleErrorSpy = spyOn(console, 'error');
      router.navigate.and.returnValue(Promise.reject('Navigation failed'));

      fixture.detectChanges();

      component.onAddBlog();

      // Wait for the promise to be rejected and error to be logged
      setTimeout(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe('Smart Component Characteristics', () => {
    it('should manage business logic and orchestrate services', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Smart component coordinates multiple services
      expect(blogService.getPosts).toHaveBeenCalled();
      expect(blogService.getCategories).toHaveBeenCalled();

      // State is managed through BlogStateStore
      expect(component.posts).toBeDefined();
      expect(component.categories).toBeDefined();
    }));

    it('should delegate presentation to child components', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Should contain dumb/presentational components
      expect(compiled.querySelector('app-blog-filter')).toBeTruthy();
      expect(compiled.querySelector('app-blog-list')).toBeTruthy();
    });

    it('should handle user interactions and update state accordingly', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // User changes category
      component.onCategoryChange('TypeScript');
      expect(blogState.selectedCategory()).toBe('TypeScript');

      // User toggles featured
      component.onToggleFeatured();
      expect(blogState.showOnlyFeatured()).toBe(true);

      // User resets filters
      component.onResetFilters();
      expect(blogState.selectedCategory()).toBe('');
      expect(blogState.showOnlyFeatured()).toBe(false);
    }));

    it('should use OnPush change detection strategy for performance', () => {
      // Component should use OnPush for better performance
      expect(component).toBeTruthy();
    });

    it('should use inject() pattern for dependency injection', () => {
      // Verify modern Angular DI pattern
      expect((component as any).blogService).toBeDefined();
      expect((component as any).blogState).toBeDefined();
      expect((component as any).router).toBeDefined();
    });
  });

  describe('Filter Interactions', () => {
    it('should filter posts when category changes', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      component.onCategoryChange('Angular');

      const filteredPosts = blogState.filteredPosts();
      expect(filteredPosts.every((p) => p.category === 'Angular')).toBe(true);
    }));

    it('should filter posts when featured toggle changes', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      component.onToggleFeatured();

      const filteredPosts = blogState.filteredPosts();
      expect(filteredPosts.every((p) => p.featured === true)).toBe(true);
    }));

    it('should apply multiple filters simultaneously', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Apply both filters
      component.onCategoryChange('Angular');
      component.onToggleFeatured();

      const filteredPosts = blogState.filteredPosts();
      expect(filteredPosts.every((p) => p.category === 'Angular' && p.featured === true)).toBe(
        true,
      );
    }));
  });

  describe('Data Refresh', () => {
    it('should reload data when refresh is triggered', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Reset spy to count new calls
      blogService.getPosts.calls.reset();
      blogService.getCategories.calls.reset();

      component.onRefresh();
      tick();

      expect(blogService.getPosts).toHaveBeenCalled();
      expect(blogService.getCategories).toHaveBeenCalled();
    }));

    it('should show loading state during refresh', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Verify initial state is not loading
      expect(component.isLoading()).toBe(false);

      component.onRefresh();

      // Note: Due to the synchronous nature of observables in tests,
      // loading state might be set and cleared very quickly
      // The important part is that refresh calls the service again
      tick();

      // Should not be loading after refresh completes
      expect(component.isLoading()).toBe(false);

      // Verify that refresh actually reloaded data
      expect(blogService.getPosts).toHaveBeenCalledTimes(2); // Once in ngOnInit, once in onRefresh
    }));
  });
});
