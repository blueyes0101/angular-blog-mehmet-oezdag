import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  first,
} from 'rxjs/operators';
import { BlogService } from '../services/blog.service';

@Injectable({
  providedIn: 'root',
})
export class BlogTitleExistsValidator implements AsyncValidator {
  constructor(private blogService: BlogService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.value.trim().length < 3) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((title) => this.checkTitleExists(title)),
      map((exists) => (exists ? { titleExists: true } : null)),
      catchError(() => of(null)),
      first(),
    );
  }

  private checkTitleExists(title: string): Observable<boolean> {
    if (!title || title.trim().length < 3) {
      return of(false);
    }

    return this.blogService.titleExists(title.trim()).pipe(
      map((response) => response.exists),
      catchError(() => of(false)),
    );
  }
}

export function blogTitleExistsValidator(blogService: BlogService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.trim().length < 3) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((title) => {
        if (!title || title.trim().length < 3) {
          return of(false);
        }
        return blogService.titleExists(title.trim()).pipe(
          map((response) => response.exists),
          catchError(() => of(false)),
        );
      }),
      map((exists) => (exists ? { titleExists: true } : null)),
      catchError(() => of(null)),
      first(),
    );
  };
}
