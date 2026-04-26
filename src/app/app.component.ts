import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AnalyticsService } from './services/analytics.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private analytics = inject(AnalyticsService);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      let label = event.urlAfterRedirects || '/';
      if (label.startsWith('/courses/')) {
        label = 'course_' + label.split('/').pop();
      }
      this.analytics.trackEvent('page_view', 'Navigation', label);
    });
  }
}
