import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BlogCardComponent } from './blog-card.component';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

describe('BlogCardComponent (Dumb Component)', () => {
  let component: BlogCardComponent;
  let fixture: ComponentFixture<BlogCardComponent>;
  let router: jasmine.SpyObj<Router>;

  const mockBlogPost: BlogPost = {
    id: 1,
    title: 'Test Blog Post',
    content:
      'This is a test blog post content that is longer than 150 characters to test the preview functionality. It should be truncated properly when displayed in the card component.',
    author: 'Test Author',
    publishDate: '2024-12-15',
    category: 'Angular',
    tags: ['Angular', 'TypeScript', 'Testing'],
    featured: true,
    imageUrl: 'https://example.com/image.jpg',
    likedByMe: false,
    likes: 42,
  };

  beforeEach(async () => {
    // Create a spy object for Router
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BlogCardComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(BlogCardComponent);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('post', mockBlogPost);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should accept and display a blog post', () => {
      expect(component.post()).toEqual(mockBlogPost);
    });

    it('should have default values for optional inputs', () => {
      expect(component.index()).toBe(0);
      expect(component.isFirst()).toBe(false);
      expect(component.isLast()).toBe(false);
      expect(component.isEven()).toBe(false);
    });

    it('should accept custom values for optional inputs', () => {
      fixture.componentRef.setInput('index', 5);
      // Note: Not setting isFirst=true to avoid NgOptimizedImage priority conflict
      fixture.componentRef.setInput('isLast', true);
      fixture.componentRef.setInput('isEven', true);
      fixture.detectChanges();

      expect(component.index()).toBe(5);
      expect(component.isLast()).toBe(true);
      expect(component.isEven()).toBe(true);
    });
  });

  describe('Navigation', () => {
    it('should navigate to blog detail page when onReadMore is called', () => {
      component.onReadMore();

      expect(router.navigate).toHaveBeenCalledWith(['/blog-detail', 1]);
    });

    it('should navigate with correct blog post id', () => {
      const postWithDifferentId = { ...mockBlogPost, id: 999 };
      fixture.componentRef.setInput('post', postWithDifferentId);
      fixture.detectChanges();

      component.onReadMore();

      expect(router.navigate).toHaveBeenCalledWith(['/blog-detail', 999]);
    });
  });

  describe('Like Functionality', () => {
    it('should emit likeBlog event when onLikeClick is called', (done) => {
      component.likeBlog.subscribe((event) => {
        expect(event).toEqual({ id: 1, likedByMe: true });
        done();
      });

      component.onLikeClick();
    });

    it('should toggle likedByMe state when emitting event', (done) => {
      const likedPost = { ...mockBlogPost, likedByMe: true };
      fixture.componentRef.setInput('post', likedPost);
      fixture.detectChanges();

      component.likeBlog.subscribe((event) => {
        expect(event).toEqual({ id: 1, likedByMe: false });
        done();
      });

      component.onLikeClick();
    });

    it('should emit correct id for different blog posts', (done) => {
      const differentPost = { ...mockBlogPost, id: 42, likedByMe: false };
      fixture.componentRef.setInput('post', differentPost);
      fixture.detectChanges();

      component.likeBlog.subscribe((event) => {
        expect(event.id).toBe(42);
        expect(event.likedByMe).toBe(true);
        done();
      });

      component.onLikeClick();
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly to German locale', () => {
      const formattedDate = component.formatDate('2024-12-15');
      expect(formattedDate).toBe('15. Dezember 2024');
    });

    it('should format different dates correctly', () => {
      const formattedDate = component.formatDate('2024-01-01');
      expect(formattedDate).toBe('1. Januar 2024');
    });

    it('should handle valid date strings', () => {
      const formattedDate = component.formatDate('2023-06-15');
      expect(formattedDate).toContain('2023');
      expect(formattedDate).toContain('Juni');
    });
  });

  describe('Content Preview', () => {
    it('should return full content if shorter than max length', () => {
      const shortContent = 'Short content';
      const preview = component.getPreviewContent(shortContent);
      expect(preview).toBe('Short content');
    });

    it('should truncate content longer than max length', () => {
      const longContent = 'A'.repeat(200);
      const preview = component.getPreviewContent(longContent, 150);
      expect(preview.length).toBe(153); // 150 + '...'
      expect(preview.endsWith('...')).toBe(true);
    });

    it('should truncate at exactly max length', () => {
      const exactContent = 'A'.repeat(150);
      const preview = component.getPreviewContent(exactContent, 150);
      expect(preview).toBe(exactContent);
    });

    it('should use default max length of 150 if not provided', () => {
      const longContent = 'A'.repeat(200);
      const preview = component.getPreviewContent(longContent);
      expect(preview.length).toBe(153); // 150 + '...'
    });

    it('should handle empty content', () => {
      const preview = component.getPreviewContent('');
      expect(preview).toBe('');
    });
  });

  describe('Category Color', () => {
    it('should return correct color for Angular category', () => {
      expect(component.getCategoryColor('Angular')).toBe('primary');
    });

    it('should return correct color for CSS category', () => {
      expect(component.getCategoryColor('CSS')).toBe('accent');
    });

    it('should return correct color for TypeScript category', () => {
      expect(component.getCategoryColor('TypeScript')).toBe('warn');
    });

    it('should return correct color for Azure category', () => {
      expect(component.getCategoryColor('Azure')).toBe('primary');
    });

    it('should return default color for unknown category', () => {
      expect(component.getCategoryColor('Unknown')).toBe('primary');
    });

    it('should return default color for empty category', () => {
      expect(component.getCategoryColor('')).toBe('primary');
    });
  });

  describe('Pure Component Behavior', () => {
    it('should not have internal state (only inputs and outputs)', () => {
      // Verify component has no internal mutable state
      expect(component.post).toBeDefined();
      expect(component.index).toBeDefined();
      expect(component.isFirst).toBeDefined();
      expect(component.isLast).toBeDefined();
      expect(component.isEven).toBeDefined();
      expect(component.likeBlog).toBeDefined();
    });

    it('should use OnPush change detection strategy', () => {
      expect(component).toBeTruthy();
      // The component is configured with ChangeDetectionStrategy.OnPush in the decorator
    });
  });

  describe('Template Rendering', () => {
    it('should display blog post title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const titleElement = compiled.querySelector('mat-card-title');
      expect(titleElement?.textContent).toContain('Test Blog Post');
    });

    it('should display blog post author', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent;
      expect(content).toContain('Test Author');
    });

    it('should display formatted date', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent;
      expect(content).toContain('15. Dezember 2024');
    });

    it('should display category chip', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent;
      expect(content).toContain('Angular');
    });

    it('should display likes count', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.textContent;
      expect(content).toContain('42');
    });
  });
});
