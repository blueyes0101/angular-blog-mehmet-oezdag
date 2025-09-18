import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../../core/services/blog.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-add-blog-page',
  templateUrl: './add-blog-page.component.html',
  styleUrls: ['./add-blog-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
})
export class AddBlogPageComponent implements OnInit {
  blogForm!: FormGroup;
  isSubmitting = false;
  userData$: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private blogService: BlogService,
    private oidcSecurityService: OidcSecurityService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.userData$ = this.oidcSecurityService.userData$;
  }

  private initializeForm(): void {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      summary: ['', [Validators.required, Validators.maxLength(200)]],
      category: ['', Validators.required],
      tags: [''],
    });
  }

  onSubmit(): void {
    if (this.blogForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const blogData = {
        ...this.blogForm.value,
        tags: this.blogForm.value.tags
          ? this.blogForm.value.tags.split(',').map((tag: string) => tag.trim())
          : [],
      };

      this.blogService.createBlog(blogData).subscribe({
        next: (_response: any) => {
          this.snackBar.open('Blog post created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.router.navigate(['/blog']);
        },
        error: (_error: any) => {
          this.isSubmitting = false;
          this.snackBar.open('Error creating blog post. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/blog']);
  }
}
