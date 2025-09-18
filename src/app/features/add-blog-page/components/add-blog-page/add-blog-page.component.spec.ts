import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BlogService } from '../../../../core/services/blog.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AddBlogPageComponent } from './add-blog-page.component';
import { BlogFormData } from './add-blog-form/add-blog-form.component';

describe('AddBlogPageComponent', () => {
  let component: AddBlogPageComponent;
  let fixture: ComponentFixture<AddBlogPageComponent>;
  let blogService: jasmine.SpyObj<BlogService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let oidcSecurityService: jasmine.SpyObj<OidcSecurityService>;

  beforeEach(async () => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', ['createBlog']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', [], {
      userData$: of({ name: 'Test User' })
    });

    await TestBed.configureTestingModule({
      imports: [AddBlogPageComponent],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBlogPageComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    oidcSecurityService = TestBed.inject(OidcSecurityService) as jasmine.SpyObj<OidcSecurityService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isLoading).toBeFalse();
    expect(component.showSuccessMessage).toBeFalse();
  });

  it('should handle form submission successfully', () => {
    const mockResponse = { id: 1, title: 'Test Title', content: 'Test Content' };
    blogService.createBlog.and.returnValue(of(mockResponse));
    spyOn(component, 'onFormReset');

    const formData: BlogFormData = {
      title: 'Test Title',
      content: 'Test Content'
    };

    component.onFormSubmit(formData);

    expect(component.isLoading).toBeTrue();
    expect(blogService.createBlog).toHaveBeenCalledWith({
      title: 'Test Title',
      content: 'Test Content',
      author: 'Anonymous',
      publishDate: jasmine.any(String),
      category: 'General',
      tags: [],
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      likedByMe: false,
      likes: 0,
    });
  });

  it('should show success message and navigate after successful submission', (done) => {
    const mockResponse = { id: 1, title: 'Test Title', content: 'Test Content' };
    blogService.createBlog.and.returnValue(of(mockResponse));

    const formData: BlogFormData = {
      title: 'Test Title',
      content: 'Test Content'
    };

    component.onFormSubmit(formData);

    setTimeout(() => {
      expect(component.isLoading).toBeFalse();
      expect(component.showSuccessMessage).toBeTrue();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Blog post created successfully!',
        'Close',
        jasmine.any(Object)
      );
      expect(router.navigate).toHaveBeenCalledWith(['/blog']);
      done();
    }, 2100);
  });

  it('should handle form submission error', () => {
    const error = new Error('API Error');
    blogService.createBlog.and.returnValue(throwError(() => error));

    const formData: BlogFormData = {
      title: 'Test Title',
      content: 'Test Content'
    };

    component.onFormSubmit(formData);

    expect(component.isLoading).toBeFalse();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Error creating blog post. Please try again.',
      'Close',
      jasmine.any(Object)
    );
  });

  it('should not submit when already loading', () => {
    component.isLoading = true;
    spyOn(component, 'onFormReset');

    const formData: BlogFormData = {
      title: 'Test Title',
      content: 'Test Content'
    };

    component.onFormSubmit(formData);

    expect(blogService.createBlog).not.toHaveBeenCalled();
  });

  it('should handle form reset', () => {
    component.showSuccessMessage = true;

    component.onFormReset();

    expect(component.showSuccessMessage).toBeFalse();
  });

  it('should navigate to blog on cancel', () => {
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/blog']);
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
