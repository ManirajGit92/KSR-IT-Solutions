import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BookCheck, Clock3, Trophy, TrendingUp, ArrowUpRight, Calendar, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <!-- Header -->
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">My Learning</p>
        <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Welcome Back! 👋</h1>
        <p class="mt-2 text-sm text-on-surface-variant font-medium">
          Track your course progress, upcoming sessions, and achievements.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article *ngFor="let item of summary; let i = index" 
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
      <div class="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <!-- Current Modules -->
        <section class="glass rounded-2xl border border-outline-variant/10 p-6">
          <h2 class="text-lg font-bold text-on-surface mb-6">Current Modules</h2>
          <div class="space-y-4">
            <article *ngFor="let module of modules; let i = index" 
                     class="group rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/10 hover:border-primary/20 transition-all hover:-translate-y-0.5 animate-fade-in-up"
                     [style.animation-delay]="(i + 4) * 100 + 'ms'">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 class="font-bold text-on-surface group-hover:text-primary transition-colors">{{ module.title }}</h3>
                  <p class="mt-1 text-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                    <lucide-icon [img]="CalendarIcon" class="w-3.5 h-3.5"></lucide-icon> {{ module.schedule }}
                  </p>
                </div>
                <span class="text-sm font-black text-gradient">{{ module.progress }}%</span>
              </div>
              <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-surface-container-high">
                <div class="h-full rounded-full bg-gradient-to-r from-primary to-tertiary transition-all duration-1000" [style.width.%]="module.progress"></div>
              </div>
            </article>
          </div>
        </section>

        <!-- Upcoming Actions -->
        <section class="glass rounded-2xl border border-outline-variant/10 p-6">
          <h2 class="text-lg font-bold text-on-surface mb-6">Upcoming Actions</h2>
          <div class="space-y-3">
            <div *ngFor="let item of actions; let i = index" 
                 class="group rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 hover:border-primary/20 transition-all hover:-translate-y-0.5 cursor-pointer animate-fade-in-up"
                 [style.animation-delay]="(i + 7) * 100 + 'ms'">
              <div class="flex items-center justify-between gap-3">
                <div class="flex-1">
                  <div class="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{{ item.title }}</div>
                  <p class="mt-1 text-sm text-on-surface-variant font-medium">{{ item.detail }}</p>
                </div>
                <lucide-icon [img]="ChevronRightIcon" class="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"></lucide-icon>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  `
})
export class StudentDashboardComponent {
  readonly ArrowUpRightIcon = ArrowUpRight;
  readonly CalendarIcon = Calendar;
  readonly ChevronRightIcon = ChevronRight;

  readonly summary = [
    { label: 'Courses Enrolled', value: '3', helper: '2 active, 1 completed', icon: BookCheck, iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { label: 'Hours Learned', value: '84', helper: '12 hours this week', icon: Clock3, iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    { label: 'Certificates', value: '2', helper: 'Eligible for 1 more', icon: Trophy, iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600' },
    { label: 'Progress', value: '76%', helper: 'Overall completion', icon: TrendingUp, iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600' }
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
