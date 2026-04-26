import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, MoreVertical, Users, GraduationCap } from 'lucide-angular';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Course Management</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage published programs, mentors, and current intake status.</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add Course
        </button>
      </div>

      <div class="grid gap-6 xl:grid-cols-3">
        <article *ngFor="let course of courses; let i = index" 
                 class="group glass rounded-2xl border border-outline-variant/10 hover:border-primary/20 p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden relative animate-fade-in-up"
                 [style.animation-delay]="i * 100 + 'ms'">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="relative z-10">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{{ course.title }}</h2>
                <p class="mt-2 text-sm text-on-surface-variant font-medium">{{ course.description }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
                      [ngClass]="course.status === 'Live' 
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'">
                  {{ course.status }}
                </span>
                <button class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <lucide-icon [img]="MoreVerticalIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>
            
            <div class="mt-6 grid grid-cols-2 gap-3">
              <div class="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/10">
                <div class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-2">
                  <lucide-icon [img]="UsersIcon" class="w-3.5 h-3.5"></lucide-icon> Students
                </div>
                <div class="text-2xl font-black text-on-surface">{{ course.students }}</div>
              </div>
              <div class="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/10">
                <div class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-2">
                  <lucide-icon [img]="GraduationCapIcon" class="w-3.5 h-3.5"></lucide-icon> Mentor
                </div>
                <div class="text-lg font-bold text-on-surface">{{ course.mentor }}</div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  `
})
export class AdminCoursesComponent {
  readonly PlusIcon = Plus;
  readonly MoreVerticalIcon = MoreVertical;
  readonly UsersIcon = Users;
  readonly GraduationCapIcon = GraduationCap;

  readonly courses = [
    { title: 'Full Stack Java', description: 'Backend APIs, Angular UI, and deployment workflow.', status: 'Live', students: 64, mentor: 'Karthik' },
    { title: 'Data Analytics', description: 'SQL, Power BI, and reporting pipelines for business teams.', status: 'Live', students: 41, mentor: 'Priya' },
    { title: 'Cloud Foundations', description: 'Azure services, CI/CD basics, and security setup.', status: 'Draft', students: 0, mentor: 'Suresh' }
  ];
}
