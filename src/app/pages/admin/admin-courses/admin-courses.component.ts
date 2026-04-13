import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 class="mt-2 text-3xl font-black tracking-tight text-on-surface">Courses</h1>
        <p class="mt-2 text-sm text-on-surface-variant">Manage published programs, mentors, and current intake status.</p>
      </div>

      <div class="grid gap-4 xl:grid-cols-3">
        <article *ngFor="let course of courses" class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-on-surface">{{ course.title }}</h2>
              <p class="mt-2 text-sm text-on-surface-variant">{{ course.description }}</p>
            </div>
            <span class="rounded-full bg-primary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
              {{ course.status }}
            </span>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-2xl bg-surface p-3">
              <div class="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Students</div>
              <div class="mt-1 font-bold text-on-surface">{{ course.students }}</div>
            </div>
            <div class="rounded-2xl bg-surface p-3">
              <div class="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Mentor</div>
              <div class="mt-1 font-bold text-on-surface">{{ course.mentor }}</div>
            </div>
          </div>
        </article>
      </div>
    </section>
  `
})
export class AdminCoursesComponent {
  readonly courses = [
    { title: 'Full Stack Java', description: 'Backend APIs, Angular UI, and deployment workflow.', status: 'Live', students: 64, mentor: 'Karthik' },
    { title: 'Data Analytics', description: 'SQL, Power BI, and reporting pipelines for business teams.', status: 'Live', students: 41, mentor: 'Priya' },
    { title: 'Cloud Foundations', description: 'Azure services, CI/CD basics, and security setup.', status: 'Draft', students: 0, mentor: 'Suresh' }
  ];
}
