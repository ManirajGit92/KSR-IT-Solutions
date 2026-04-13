import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BookOpen, Users, TrendingUp, Layers2 } from 'lucide-angular';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin Dashboard</p>
        <h1 class="mt-2 text-3xl font-black tracking-tight text-on-surface">Platform overview</h1>
        <p class="mt-2 max-w-3xl text-sm text-on-surface-variant">
          Monitor enrollments, content readiness, and learner activity from one place.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article *ngFor="let item of stats" class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <div class="flex items-center justify-between">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">{{ item.label }}</div>
            <lucide-icon [img]="item.icon" class="h-5 w-5 text-primary"></lucide-icon>
          </div>
          <div class="mt-4 text-3xl font-black text-on-surface">{{ item.value }}</div>
          <p class="mt-2 text-sm text-on-surface-variant">{{ item.helper }}</p>
        </article>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <h2 class="text-lg font-bold text-on-surface">Weekly activity</h2>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div *ngFor="let item of activity" class="rounded-2xl bg-surface p-4">
              <div class="text-sm font-semibold text-primary">{{ item.title }}</div>
              <div class="mt-2 text-2xl font-black text-on-surface">{{ item.value }}</div>
              <p class="mt-1 text-xs uppercase tracking-[0.2em] text-on-surface-variant">{{ item.caption }}</p>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <h2 class="text-lg font-bold text-on-surface">Admin checklist</h2>
          <div class="mt-5 space-y-3">
            <div *ngFor="let task of checklist" class="rounded-2xl border border-outline-variant/10 bg-surface p-4">
              <div class="flex items-center justify-between gap-3">
                <span class="font-semibold text-on-surface">{{ task.title }}</span>
                <span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                  [class.bg-tertiary-container]="task.status === 'Ready'"
                  [class.text-on-tertiary-container]="task.status === 'Ready'"
                  [class.bg-secondary-container]="task.status !== 'Ready'"
                  [class.text-on-secondary-container]="task.status !== 'Ready'">
                  {{ task.status }}
                </span>
              </div>
              <p class="mt-2 text-sm text-on-surface-variant">{{ task.detail }}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  `
})
export class AdminDashboardComponent {
  readonly stats = [
    { label: 'Active Courses', value: '12', helper: '3 scheduled for next intake', icon: BookOpen },
    { label: 'Learners', value: '248', helper: '19 joined this week', icon: Users },
    { label: 'Completion Rate', value: '87%', helper: 'Improved 6% month over month', icon: TrendingUp },
    { label: 'Landing Sections', value: '9', helper: '2 need copy updates', icon: Layers2 }
  ];

  readonly activity = [
    { title: 'New enrollments', value: '19', caption: 'Last 7 days' },
    { title: 'Pending approvals', value: '6', caption: 'Awaiting admin review' },
    { title: 'Certificates issued', value: '14', caption: 'Generated this month' },
    { title: 'Content updates', value: '8', caption: 'Published to live site' }
  ];

  readonly checklist = [
    { title: 'Dashboard route connected', status: 'Ready', detail: 'The admin home page is now mapped to a real component.' },
    { title: 'Course management screen', status: 'Ready', detail: 'Sidebar navigation now opens the dedicated courses screen.' },
    { title: 'User operations', status: 'Ready', detail: 'User list and role summary screen is available from the sidebar.' }
  ];
}
