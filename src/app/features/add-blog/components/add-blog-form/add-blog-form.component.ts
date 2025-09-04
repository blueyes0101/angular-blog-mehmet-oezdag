import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

@Component({
  selector: 'app-add-blog-form',
  templateUrl: './add-blog-form.component.html',
  styleUrls: ['./add-blog-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class AddBlogFormComponent {
  // Input signals
  isSaving = input<boolean>(false);

  // Output signals
  submitBlog = output<Partial<BlogPost>>();
  cancel = output<void>();

  // Form state signals
  title = signal('');
  content = signal('');
  author = signal('');
  category = signal('');
  imageUrl = signal('');
  featured = signal(false);
  tags = signal<string[]>([]);
  newTag = signal('');

  // Available categories
  readonly categories = [
    'Angular',
    'TypeScript',
    'JavaScript',
    'CSS',
    'HTML',
    'Azure',
    'Docker',
    'Testing',
    'Performance',
    'Security',
  ];

  /**
   * Adds a new tag
   */
  addTag(): void {
    const tag = this.newTag().trim();
    if (tag && !this.tags().includes(tag)) {
      this.tags.update(tags => [...tags, tag]);
      this.newTag.set('');
    }
  }

  /**
   * Removes a tag
   */
  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  /**
   * Validates the form
   */
  isFormValid(): boolean {
    return !!(
      this.title().trim() &&
      this.content().trim() &&
      this.author().trim() &&
      this.category() &&
      this.imageUrl().trim() &&
      this.tags().length > 0
    );
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.isFormValid() && !this.isSaving()) {
      this.submitBlog.emit({
        title: this.title(),
        content: this.content(),
        author: this.author(),
        category: this.category(),
        imageUrl: this.imageUrl(),
        featured: this.featured(),
        tags: this.tags(),
      });
    }
  }

  /**
   * Handles cancel action
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
