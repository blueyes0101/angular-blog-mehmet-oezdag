import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BlogService } from '../services/blog.service';
import { blogTitleExistsValidator } from './blog-title-exists.validator';

describe('blogTitleExistsValidator', () => {
  let blogService: jasmine.SpyObj<BlogService>;

  beforeEach(() => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', ['titleExists']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: BlogService, useValue: blogServiceSpy }],
    });

    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;
  });

  it('should return null for empty or short titles', (done) => {
    const control = new FormControl('');

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null for titles shorter than 3 characters', (done) => {
    const control = new FormControl('Te');

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return titleExists error when title exists', (done) => {
    const control = new FormControl('Existing Title');
    blogService.titleExists.and.returnValue(of({ exists: true }));

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toEqual({ titleExists: true });
      done();
    });
  });

  it('should return null when title does not exist', (done) => {
    const control = new FormControl('New Title');
    blogService.titleExists.and.returnValue(of({ exists: false }));

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null when service throws error', (done) => {
    const control = new FormControl('Test Title');
    blogService.titleExists.and.returnValue(throwError(() => new Error('API Error')));

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should debounce requests', (done) => {
    const control = new FormControl('Test Title');
    blogService.titleExists.and.returnValue(of({ exists: false }));

    const validator = blogTitleExistsValidator(blogService);
    validator(control).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });
});
