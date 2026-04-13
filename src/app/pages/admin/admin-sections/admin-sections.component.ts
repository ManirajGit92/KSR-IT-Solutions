import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sections',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 class="mt-2 text-3xl font-black tracking-tight text-on-surface">Section Builder</h1>
        <p class="mt-2 text-sm text-on-surface-variant">Review the homepage blocks and their publishing status.</p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article *ngFor="let section of sections" class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-bold text-on-surface">{{ section.name }}</h2>
            <span class="rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
              {{ section.state }}
            </span>
          </div>
          <p class="mt-3 text-sm text-on-surface-variant">{{ section.description }}</p>
          <div class="mt-5 text-xs uppercase tracking-[0.2em] text-on-surface-variant">Last edited {{ section.updatedAt }}</div>
        </article>
      </div>
    </section>
  `
})
export class AdminSectionsComponent {
  readonly sections = [
    { name: 'Hero Banner', state: 'Published', description: 'Top-level campaign message and CTA buttons.', updatedAt: '2 days ago' },
    { name: 'Courses Grid', state: 'Published', description: 'Featured programs shown on the landing page.', updatedAt: 'Today' },
    { name: 'Testimonials', state: 'Needs review', description: 'Student success stories waiting for fresh copy.', updatedAt: '4 days ago' }
  ];
}
