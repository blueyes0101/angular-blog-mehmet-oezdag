import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
})
export class ErrorComponent {
  // Input signals
  errorCode = input<number>(500);
  errorMessage = input<string>('Ein unerwarteter Fehler ist aufgetreten');
  errorDetails = input<string>('');

  /**
   * Reloads the current page
   */
  reloadPage(): void {
    window.location.reload();
  }
}
