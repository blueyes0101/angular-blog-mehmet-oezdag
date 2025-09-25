import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    // Create spy for BreakpointObserver
    mockBreakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    mockBreakpointObserver.observe.and.returnValue(of({ matches: false, breakpoints: {} }));

    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent, // Import the standalone component
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        // Mock OIDC service
        {
          provide: OidcSecurityService,
          useValue: {
            isAuthenticated$: of({ isAuthenticated: false }),
            userData$: of({ userData: null }),
            authorize: jasmine.createSpy('authorize'),
            logoffAndRevokeTokens: jasmine
              .createSpy('logoffAndRevokeTokens')
              .and.returnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.navigationItems).toBeDefined();
    expect(component.navigationItems.length).toBeGreaterThan(0);
  });

  it('should observe breakpoint changes', () => {
    fixture.detectChanges();
    expect(mockBreakpointObserver.observe).toHaveBeenCalled();
  });
});
