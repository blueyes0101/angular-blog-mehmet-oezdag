import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockOidcSecurityService {
  isAuthenticated$ = of({ isAuthenticated: true });
  userData$ = of({
    preferred_username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    realm_access: { roles: ['user'] },
  });

  authorize(): void {
    console.log('Mock OIDC: authorize() called');
  }

  logoff(): Observable<any> {
    console.log('Mock OIDC: logoff() called');
    return of(null);
  }
}
