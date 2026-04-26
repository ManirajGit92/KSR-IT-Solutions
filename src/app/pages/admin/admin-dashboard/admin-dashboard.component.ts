import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BookOpen, Users, TrendingUp, Layers2, ArrowUpRight, Clock } from 'lucide-angular';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin Dashboard</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Platform Overview</h1>
          <p class="mt-2 max-w-3xl text-sm text-on-surface-variant font-medium">
            Monitor enrollments, content readiness, and learner activity from one place.
          </p>
        </div>
        <div class="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
          <lucide-icon [img]="ClockIcon" class="w-4 h-4"></lucide-icon>
          Last updated: Just now
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article *ngFor="let item of stats; let i = index" 
                 class="group glass rounded-2xl p-6 border border-outline-variant/10 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl overflow-hidden relative animate-fade-in-up"
                 [style.animation-delay]="i * 100 + 'ms'">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between">
              <div class="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">{{ item.label }}</div>
              <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-md"
                   [ngClass]="item.iconBg">
                <lucide-icon [img]="item.icon" class="h-5 w-5 text-white"></lucide-icon>
              </div>
            </div>
            <div class="mt-4 text-4xl font-black text-on-surface">{{ item.value }}</div>
            <div class="mt-2 flex items-center gap-1 text-sm font-medium">
              <lucide-icon [img]="ArrowUpRightIcon" class="w-3.5 h-3.5 text-green-500"></lucide-icon>
              <span class="text-on-surface-variant">{{ item.helper }}</span>
            </div>
          </div>
        </article>
      </div>

      <!-- Content Grid -->
      <div class="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <!-- Weekly Activity -->
        <section class="glass rounded-2xl border border-outline-variant/10 p-6">
          <h2 class="text-lg font-bold text-on-surface mb-6">Weekly Activity</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div *ngFor="let item of activity" class="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/10 hover:border-primary/20 transition-all hover:-translate-y-0.5 group">
              <div class="text-sm font-semibold text-primary">{{ item.title }}</div>
              <div class="mt-3 text-3xl font-black text-on-surface group-hover:text-gradient transition-colors">{{ item.value }}</div>
              <p class="mt-2 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">{{ item.caption }}</p>
            </div>
          </div>
        </section>

        <!-- Admin Checklist -->
        <section class="glass rounded-2xl border border-outline-variant/10 p-6">
          <h2 class="text-lg font-bold text-on-surface mb-6">Admin Checklist</h2>
          <div class="space-y-3">
            <div *ngFor="let task of checklist" class="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 hover:border-primary/20 transition-all hover:-translate-y-0.5">
              <div class="flex items-center justify-between gap-3">
                <span class="font-bold text-on-surface text-sm">{{ task.title }}</span>
                <span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
                  [ngClass]="task.status === 'Ready' 
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                    : 'bg-secondary/10 text-secondary'">
                  {{ task.status }}
                </span>
              </div>
              <p class="mt-2 text-sm text-on-surface-variant font-medium">{{ task.detail }}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  `
})
export class AdminDashboardComponent {
  readonly ArrowUpRightIcon = ArrowUpRight;
  readonly ClockIcon = Clock;

  readonly stats = [
    { label: 'Active Courses', value: '12', helper: '3 scheduled for next intake', icon: BookOpen, iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { label: 'Learners', value: '248', helper: '19 joined this week', icon: Users, iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    { label: 'Completion Rate', value: '87%', helper: 'Improved 6% month over month', icon: TrendingUp, iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600' },
    { label: 'Landing Sections', value: '9', helper: '2 need copy updates', icon: Layers2, iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600' }
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
