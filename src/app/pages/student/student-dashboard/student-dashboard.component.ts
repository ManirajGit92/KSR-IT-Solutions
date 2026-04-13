import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BookCheck, Clock3, Trophy, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">Student Tracking</p>
        <h1 class="mt-2 text-3xl font-black tracking-tight text-on-surface">Learning dashboard</h1>
        <p class="mt-2 text-sm text-on-surface-variant">
          Follow course progress, upcoming sessions, and achievement milestones from one place.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article *ngFor="let item of summary" class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <div class="flex items-center justify-between">
            <div class="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">{{ item.label }}</div>
            <lucide-icon [img]="item.icon" class="h-5 w-5 text-primary"></lucide-icon>
          </div>
          <div class="mt-4 text-3xl font-black text-on-surface">{{ item.value }}</div>
          <p class="mt-2 text-sm text-on-surface-variant">{{ item.helper }}</p>
        </article>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <h2 class="text-lg font-bold text-on-surface">Current modules</h2>
          <div class="mt-5 space-y-4">
            <article *ngFor="let module of modules" class="rounded-2xl bg-surface p-5">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="font-semibold text-on-surface">{{ module.title }}</h3>
                  <p class="mt-1 text-sm text-on-surface-variant">{{ module.schedule }}</p>
                </div>
                <span class="text-sm font-bold text-primary">{{ module.progress }}%</span>
              </div>
              <div class="mt-4 h-3 overflow-hidden rounded-full bg-surface-container-high">
                <div class="h-full rounded-full bg-primary" [style.width.%]="module.progress"></div>
              </div>
            </article>
          </div>
        </section>

        <section class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <h2 class="text-lg font-bold text-on-surface">Upcoming actions</h2>
          <div class="mt-5 space-y-3">
            <div *ngFor="let item of actions" class="rounded-2xl border border-outline-variant/10 bg-surface p-4">
              <div class="font-semibold text-on-surface">{{ item.title }}</div>
              <p class="mt-1 text-sm text-on-surface-variant">{{ item.detail }}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  `
})
export class StudentDashboardComponent {
  readonly summary = [
    { label: 'Courses Enrolled', value: '3', helper: '2 active and 1 completed', icon: BookCheck },
    { label: 'Hours Learned', value: '84', helper: '12 hours this week', icon: Clock3 },
    { label: 'Certificates', value: '2', helper: 'Eligible for one more this month', icon: Trophy },
    { label: 'Progress', value: '76%', helper: 'Overall completion across active tracks', icon: TrendingUp }
  ];

  readonly modules = [
    { title: 'Angular Fundamentals', schedule: 'Mon, Wed, Fri - 7:00 PM', progress: 82 },
    { title: 'SQL Query Design', schedule: 'Tue, Thu - 6:30 PM', progress: 68 },
    { title: 'Interview Readiness', schedule: 'Saturday - 10:00 AM', progress: 54 }
  ];

  readonly actions = [
    { title: 'Submit mini project', detail: 'Upload the REST API assignment before Friday evening.' },
    { title: 'Attend mentor review', detail: 'One-on-one progress review scheduled for Wednesday.' },
    { title: 'Practice assessment', detail: 'Complete the mock test to unlock the next module.' }
  ];
}
