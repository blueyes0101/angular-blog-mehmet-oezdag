// Fixed TypeScript compilation error - CI cache issue resolved - 2025-08-07 13:37
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { BlogDetailContainerComponent } from './blog-detail-container.component';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

describe('BlogDetailContainerComponent (Smart Component)', () => {
  let component: BlogDetailContainerComponent;
  let fixture: ComponentFixture<BlogDetailContainerComponent>;
  let blogService: jasmine.SpyObj<BlogService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRouteSpy: any;

  const mockBlogPost: BlogPost = {
    id: 1,
    title: 'Test Blog Post',
    content:
      'This is a comprehensive test blog post content that should be displayed in the detail view.',
    author: 'Test Author',
    publishDate: '2024-01-15',
    category: 'Angular',
    tags: ['test', 'angular', 'blog'],
    featured: true,
    imageUrl: 'https://example.com/test-image.jpg',
    likedByMe: false,
    likes: 0,
  };

  beforeEach(async () => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', ['getPost']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Create a proper spy object for ActivatedRoute
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['toString'], {
      params: of({ id: '1' }),
      snapshot: { params: { id: '1' } },
      data: of({ blogPost: mockBlogPost }),
    });

    await TestBed.configureTestingModule({
      imports: [BlogDetailContainerComponent, NoopAnimationsModule],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailContainerComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default service response
    blogService.getPost.and.returnValue(of(mockBlogPost));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be a Smart Component (manages state and data fetching)', () => {
    // Smart component should have observables and state management
    expect(component.blogPost$).toBeDefined();

    // Should have navigation methods
    expect(component.onBackToBlog).toBeDefined();
    expect(component.onShare).toBeDefined();
  });

  it('should load blog post from route data', (done) => {
    // Mock route data with resolved blog post
    (activatedRouteSpy as any).data = of({ blogPost: mockBlogPost });
    component.ngOnInit();

    component.blogPost$.subscribe((post) => {
      if (post) {
        expect(post).toEqual(mockBlogPost);
        done();
      }
    });
  });

  it('should navigate back to blog overview', () => {
    component.onBackToBlog();
    expect(router.navigate).toHaveBeenCalledWith(['/blog']);
  });

  it('should display blog detail view component when post is loaded', () => {
    (activatedRouteSpy as any).data = of({ blogPost: mockBlogPost });
    component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    // Should contain app-blog-detail-view component
    expect(compiled.querySelector('app-blog-detail-view')).toBeTruthy();
  });

  it('should pass correct data to dumb component', (done) => {
    (activatedRouteSpy as any).data = of({ blogPost: mockBlogPost });
    component.ngOnInit();

    component.blogPost$.subscribe((post) => {
      if (post) {
        // Verify the post data is available for the dumb component
        expect(post.title).toBe(mockBlogPost.title);
        expect(post.content).toBe(mockBlogPost.content);
        expect(post.author).toBe(mockBlogPost.author);
        expect(post.publishDate).toBe(mockBlogPost.publishDate);
        done();
      }
    });
  });
});
