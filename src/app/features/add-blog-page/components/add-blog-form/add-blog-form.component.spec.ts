import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BlogService } from '../../../../core/services/blog.service';
import { AddBlogFormComponent, BlogFormData } from './add-blog-form.component';

describe('AddBlogFormComponent', () => {
  let component: AddBlogFormComponent;
  let fixture: ComponentFixture<AddBlogFormComponent>;
  let blogService: jasmine.SpyObj<BlogService>;

  beforeEach(async () => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', ['titleExists']);

    await TestBed.configureTestingModule({
      imports: [AddBlogFormComponent, ReactiveFormsModule],
      providers: [
        { provide: BlogService, useValue: blogServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBlogFormComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.blogForm.get('title')?.value).toBe('');
    expect(component.blogForm.get('content')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const titleControl = component.blogForm.get('title');
    const contentControl = component.blogForm.get('content');

    expect(titleControl?.hasError('required')).toBeTruthy();
    expect(contentControl?.hasError('required')).toBeTruthy();
  });

  it('should validate title min length', () => {
    const titleControl = component.blogForm.get('title');
    titleControl?.setValue('ab');
    expect(titleControl?.hasError('minlength')).toBeTruthy();
  });

  it('should validate title max length', () => {
    const titleControl = component.blogForm.get('title');
    const longTitle = 'a'.repeat(121);
    titleControl?.setValue(longTitle);
    expect(titleControl?.hasError('maxlength')).toBeTruthy();
  });

  it('should validate content min length', () => {
    const contentControl = component.blogForm.get('content');
    contentControl?.setValue('short');
    expect(contentControl?.hasError('minlength')).toBeTruthy();
  });

  it('should validate content max length', () => {
    const contentControl = component.blogForm.get('content');
    const longContent = 'a'.repeat(20001);
    contentControl?.setValue(longContent);
    expect(contentControl?.hasError('maxlength')).toBeTruthy();
  });

  it('should validate no empty trim', () => {
    const titleControl = component.blogForm.get('title');
    titleControl?.setValue('   ');
    expect(titleControl?.hasError('emptyTrim')).toBeTruthy();
  });

  it('should emit formSubmit when form is valid', () => {
    spyOn(component.formSubmit, 'emit');
    blogService.titleExists.and.returnValue(of({ exists: false }));

    component.blogForm.patchValue({
      title: 'Valid Title',
      content: 'Valid content with enough characters'
    });

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      title: 'Valid Title',
      content: 'Valid content with enough characters'
    });
  });

  it('should not emit formSubmit when form is invalid', () => {
    spyOn(component.formSubmit, 'emit');

    component.blogForm.patchValue({
      title: 'ab', // Too short
      content: 'Valid content'
    });

    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should not emit formSubmit when loading', () => {
    spyOn(component.formSubmit, 'emit');
    component.isLoading = true;

    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should reset form and emit formReset', () => {
    spyOn(component.formReset, 'emit');
    spyOn(component.blogForm, 'reset');

    component.onReset();

    expect(component.blogForm.reset).toHaveBeenCalled();
    expect(component.formReset.emit).toHaveBeenCalled();
  });

  it('should return correct error messages', () => {
    const titleControl = component.blogForm.get('title');
    titleControl?.setValue('');
    titleControl?.markAsTouched();

    expect(component.getFieldError('title')).toBe('Title is required');
  });

  it('should return empty string for valid fields', () => {
    const titleControl = component.blogForm.get('title');
    titleControl?.setValue('Valid Title');
    titleControl?.markAsTouched();

    expect(component.getFieldError('title')).toBe('');
  });

  it('should return titleExists error message', () => {
    const titleControl = component.blogForm.get('title');
    titleControl?.setValue('Existing Title');
    titleControl?.setErrors({ titleExists: true });
    titleControl?.markAsTouched();

    expect(component.getFieldError('title')).toBe('Not a valid Title');
  });

  it('should return correct field label', () => {
    expect(component['getFieldLabel']('title')).toBe('Title');
    expect(component['getFieldLabel']('content')).toBe('Content');
  });

  it('should check if field is invalid', () => {
    const titleControl = component.blogForm.get('title');
    titleControl?.setValue('');
    titleControl?.markAsTouched();

    expect(component.isFieldInvalid('title')).toBeTruthy();
  });

  it('should check if form is valid', () => {
    blogService.titleExists.and.returnValue(of({ exists: false }));
    
    component.blogForm.patchValue({
      title: 'Valid Title',
      content: 'Valid content with enough characters'
    });

    expect(component.isFormValid()).toBeTruthy();
  });
});
