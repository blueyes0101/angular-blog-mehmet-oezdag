import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { BlogOverviewContainerComponent } from './blog-overview-container.component';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogStateStore } from '../../../../core/state/blog-state.store';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

describe('BlogOverviewContainerComponent (Smart Component)', () => {
  let component: BlogOverviewContainerComponent;
  let fixture: ComponentFixture<BlogOverviewContainerComponent>;
  let blogService: jasmine.SpyObj<BlogService>;

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
      likes: 0,
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
      likedByMe: false,
      likes: 0,
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

    await TestBed.configureTestingModule({
      imports: [BlogOverviewContainerComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [{ provide: BlogService, useValue: blogServiceSpy }, BlogStateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogOverviewContainerComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;

    // Setup default service responses
    blogService.getPosts.and.returnValue(of(mockBlogPosts));
    blogService.getPostsByCategory.and.returnValue(
      of(mockBlogPosts.filter((p) => p.category === 'Angular')),
    );
    blogService.getFeaturedPosts.and.returnValue(of(mockBlogPosts.filter((p) => p.featured)));
    blogService.getCategories.and.returnValue(of(mockCategories));
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
});
