import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  @Input() content: any = {
    title: 'Launch Your IT Career With Confidence',
    subtitle: 'Industry-driven training in Full Stack, Cloud, Data Engineering & more. Get certified, build real projects, and land your dream tech job with our 95% placement record.',
    buttonText: '🚀 Join Now',
    buttonLink: '#contact',
    bgImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    badgeText: 'New Batch Starting May 2026'
  };
}
