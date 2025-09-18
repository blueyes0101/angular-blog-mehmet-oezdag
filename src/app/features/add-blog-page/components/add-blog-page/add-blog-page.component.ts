import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../../core/services/blog.service';
// import { OidcSecurityService } from 'angular-auth-oidc-client'; // Temporarily disabled
import { MockOidcSecurityService } from '../../../../core/services/mock-oidc.service';
import { AddBlogFormComponent, BlogFormData } from '../add-blog-form/add-blog-form.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-blog-page',
  templateUrl: './add-blog-page.component.html',
  styleUrls: ['./add-blog-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    AddBlogFormComponent,
  ],
})
export class AddBlogPageComponent implements OnInit, OnDestroy {
  isLoading = false;
  showSuccessMessage = false;
  userData$: any;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private blogService: BlogService,
    private oidcSecurityService: MockOidcSecurityService,
  ) {}

  ngOnInit(): void {
    this.userData$ = this.oidcSecurityService.userData$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFormSubmit(formData: BlogFormData): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showSuccessMessage = false;

    const blogData = {
      title: formData.title,
      content: formData.content,
      author: 'Anonymous', // This could be enhanced to get from user data
      publishDate: new Date().toISOString().split('T')[0],
      category: 'General',
      tags: [],
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      likedByMe: false,
      likes: 0,
    };

    this.blogService.createBlog(blogData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccessMessage = true;
          
          // Show success toast
          this.snackBar.open('Blog post created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          // Navigate back to blog overview after a short delay
          setTimeout(() => {
            this.router.navigate(['/blog']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating blog post:', error);
          
          this.snackBar.open('Error creating blog post. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
  }

  onFormReset(): void {
    this.showSuccessMessage = false;
  }

  onCancel(): void {
    this.router.navigate(['/blog']);
  }
}
