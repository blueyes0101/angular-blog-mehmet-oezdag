import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BlogService } from '../../../../core/services/blog.service';
import { blogTitleExistsValidator } from '../../../../core/validators/blog-title-exists.validator';

export interface BlogFormData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-add-blog-form',
  templateUrl: './add-blog-form.component.html',
  styleUrls: ['./add-blog-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddBlogFormComponent implements OnInit, OnDestroy {
  @Input() isLoading = false;
  @Input() showSuccessMessage = false;
  @Output() formSubmit = new EventEmitter<BlogFormData>();
  @Output() formReset = new EventEmitter<void>();

  blogForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.blogForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(120),
          this.noEmptyTrimValidator,
        ],
        [blogTitleExistsValidator(this.blogService)],
      ],
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(20000),
          this.noEmptyTrimValidator,
        ],
      ],
    });
  }

  private noEmptyTrimValidator(control: any) {
    if (control.value && control.value.trim() === '') {
      return { emptyTrim: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.blogForm.valid && !this.isLoading) {
      const formData: BlogFormData = {
        title: this.blogForm.value.title.trim(),
        content: this.blogForm.value.content.trim(),
      };
      this.formSubmit.emit(formData);
    }
  }

  onReset(): void {
    this.blogForm.reset();
    this.formReset.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.blogForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
    }
    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].maxLength;
      return `${this.getFieldLabel(fieldName)} must not exceed ${maxLength} characters`;
    }
    if (errors['emptyTrim']) {
      return `${this.getFieldLabel(fieldName)} cannot be empty`;
    }
    if (errors['titleExists']) {
      return 'Not a valid Title';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      title: 'Title',
      content: 'Content',
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.blogForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFormValid(): boolean {
    return this.blogForm.valid;
  }
}
