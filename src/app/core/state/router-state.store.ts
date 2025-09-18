import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// State interface
export interface RouterState {
  isLoading: boolean;
  currentUrl: string;
}

// Initial state
const initialState: RouterState = {
  isLoading: false,
  currentUrl: '',
};

@Injectable({
  providedIn: 'root',
})
export class RouterStateStore {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Private state signal
  private readonly state = signal<RouterState>(initialState);

  // Computed signals for reading state
  readonly isLoading = computed(() => this.state().isLoading);
  readonly currentUrl = computed(() => this.state().currentUrl);

  constructor() {
    this.initializeRouterEvents();
  }

  // Private methods for state updates
  private setLoadingState(isLoading: boolean): void {
    this.state.update((state) => ({ ...state, isLoading }));
  }

  private setCurrentUrl(currentUrl: string): void {
    this.state.update((state) => ({ ...state, currentUrl }));
  }

  // Initialize router events subscription
  private initializeRouterEvents(): void {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.setLoadingState(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.setLoadingState(false);
        if (event instanceof NavigationEnd) {
          this.setCurrentUrl(event.urlAfterRedirects);
        }
      }
    });
  }
}
