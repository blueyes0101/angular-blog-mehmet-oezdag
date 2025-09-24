import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BlogListComponent } from './blog-list.component';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

describe('BlogListComponent (Dumb Component)', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be a Dumb Component (only displays data)', () => {
    // Dumb component should only have input signals and display methods
    expect(component.posts).toBeDefined();
    expect(component.isLoading).toBeDefined();
    expect(component.hasFilters).toBeDefined();
    expect(component.trackByPost).toBeDefined();

    // Should not have complex state management - this is a dumb component
    expect(typeof component.posts()).toBe('object');
    expect(typeof component.isLoading()).toBe('boolean');
  });

  it('should display loading spinner when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const loadingContainer = compiled.querySelector('.loading-container');
    const spinner = compiled.querySelector('mat-spinner');

    expect(loadingContainer).toBeTruthy();
    expect(spinner).toBeTruthy();
  });

  it('should display posts when isLoading is false and posts are provided', () => {
    fixture.componentRef.setInput('posts', mockBlogPosts);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const blogGrid = compiled.querySelector('.blog-posts-grid');
    const blogCards = compiled.querySelectorAll('app-blog-card');

    expect(blogGrid).toBeTruthy();
    expect(blogCards.length).toBe(mockBlogPosts.length);
  });

  it('should display empty state when no posts are available', () => {
    fixture.componentRef.setInput('posts', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('hasFilters', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyState = compiled.querySelector('.empty-state');
    const emptyMessage = compiled.textContent;

    expect(emptyState).toBeTruthy();
    expect(emptyMessage).toContain('Keine Blog-Posts gefunden');
    expect(emptyMessage).toContain('Es sind derzeit keine Blog-Posts verfügbar');
  });

  it('should display filter-specific empty state when hasFilters is true', () => {
    fixture.componentRef.setInput('posts', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('hasFilters', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyState = compiled.querySelector('.empty-state');
    const emptyMessage = compiled.textContent;

    expect(emptyState).toBeTruthy();
    expect(emptyMessage).toContain('Versuchen Sie andere Filter');
  });

  it('should not display blog grid when loading', () => {
    fixture.componentRef.setInput('posts', mockBlogPosts);
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const blogGrid = compiled.querySelector('.blog-posts-grid');

    expect(blogGrid).toBeFalsy();
  });

  it('should provide trackByPost function for performance', () => {
    const post = mockBlogPosts[0];
    const result = component.trackByPost(0, post);

    expect(result).toBe(post.id);
    expect(typeof result).toBe('number');
  });

  it('should pass correct data to blog card components', () => {
    fixture.componentRef.setInput('posts', mockBlogPosts);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const blogCards = compiled.querySelectorAll('app-blog-card');

    expect(blogCards.length).toBe(mockBlogPosts.length);

    // Check that each card component is present
    for (const card of blogCards) {
      expect(card).toBeTruthy();
    }
  });

  it('should handle posts input changes correctly', () => {
    // Initially no posts
    fixture.componentRef.setInput('posts', []);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    let compiled = fixture.nativeElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();

    // Add posts
    fixture.componentRef.setInput('posts', mockBlogPosts);
    fixture.detectChanges();

    compiled = fixture.nativeElement;
    expect(compiled.querySelector('.blog-posts-grid')).toBeTruthy();
    expect(compiled.querySelector('.empty-state')).toBeFalsy();
  });

  it('should handle isLoading state changes correctly', () => {
    fixture.componentRef.setInput('posts', mockBlogPosts);

    // Start with loading
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    let compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-container')).toBeTruthy();
    expect(compiled.querySelector('.blog-posts-grid')).toBeFalsy();

    // Stop loading
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-container')).toBeFalsy();
    expect(compiled.querySelector('.blog-posts-grid')).toBeTruthy();
  });

  it('should be a pure display component without side effects', () => {
    // Should only respond to input changes
    // Setting inputs should not trigger side effects
    fixture.componentRef.setInput('posts', mockBlogPosts);
    fixture.componentRef.setInput('isLoading', true);
    fixture.componentRef.setInput('hasFilters', true);
    fixture.detectChanges();

    // Component should simply reflect the new input values
    expect(component.posts()).toEqual(mockBlogPosts);
    expect(component.isLoading()).toBe(true);
    expect(component.hasFilters()).toBe(true);
  });
});
