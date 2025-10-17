import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../../core/services/blog.service';
import { AuthStore } from '../../../../core/auth/auth.store';
import { AddBlogFormComponent, BlogFormData } from '../add-blog-form/add-blog-form.component';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-add-blog-page',
  templateUrl: './add-blog-page.component.html',
  styleUrls: ['./add-blog-page.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatSnackBarModule, MatIconModule, AddBlogFormComponent],
})
export class AddBlogPageComponent implements OnInit, OnDestroy {
  isLoading = false;
  showSuccessMessage = false;
  private destroy$ = new Subject<void>();

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly blogService = inject(BlogService);
  private readonly authStore = inject(AuthStore);
  private readonly languageService = inject(LanguageService);

  // Expose authentication state
  readonly userData = this.authStore.userData;
  readonly username = this.authStore.username;

  ngOnInit(): void {
    console.log('[AddBlogPage] Component initialized');
    console.log('[AddBlogPage] User:', this.username());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFormSubmit(formData: BlogFormData): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showSuccessMessage = false;

    // Get author from authenticated user
    const authorName = this.username() || 'Anonymous';

    const blogData = {
      title: formData.title,
      content: formData.content,
      author: authorName,
      publishDate: new Date().toISOString().split('T')[0],
      category: 'General',
      tags: [],
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      likedByMe: false,
      likes: 0,
    };

    console.log('[AddBlogPage] Creating blog post:', blogData);

    this.blogService
      .createBlog(blogData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (_response) => {
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
            const currentLang = this.languageService.currentLanguage();
            this.router.navigate([`/${currentLang}/blog`]);
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
    const currentLang = this.languageService.currentLanguage();
    this.router.navigate([`/${currentLang}/blog`]);
  }
}
