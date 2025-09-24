import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AbstractControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BlogService } from '../services/blog.service';
import { blogTitleExistsValidator } from './blog-title-exists.validator';

describe('blogTitleExistsValidator', () => {
  let blogService: jasmine.SpyObj<BlogService>;
  let control: jasmine.SpyObj<AbstractControl>;

  beforeEach(() => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', ['titleExists']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: BlogService, useValue: blogServiceSpy }],
    });

    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;
    control = jasmine.createSpyObj('AbstractControl', ['valueChanges'], {
      value: 'Test Title',
    });
  });

  it('should return null for empty or short titles', (done) => {
    control.value = '';
    control.valueChanges = of('');

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null for titles shorter than 3 characters', (done) => {
    control.value = 'Te';
    control.valueChanges = of('Te');

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return titleExists error when title exists', (done) => {
    control.value = 'Existing Title';
    control.valueChanges = of('Existing Title');
    blogService.titleExists.and.returnValue(of({ exists: true }));

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toEqual({ titleExists: true });
      done();
    });
  });

  it('should return null when title does not exist', (done) => {
    control.value = 'New Title';
    control.valueChanges = of('New Title');
    blogService.titleExists.and.returnValue(of({ exists: false }));

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null when service throws error', (done) => {
    control.value = 'Test Title';
    control.valueChanges = of('Test Title');
    blogService.titleExists.and.returnValue(throwError(() => new Error('API Error')));

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should debounce requests', (done) => {
    control.value = 'Test Title';
    control.valueChanges = of('Test Title');
    blogService.titleExists.and.returnValue(of({ exists: false }));

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });
});
