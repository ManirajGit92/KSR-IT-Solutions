import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-certificates',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">Student Portal</p>
        <h1 class="mt-2 text-3xl font-black tracking-tight text-on-surface">Certificates</h1>
        <p class="mt-2 text-sm text-on-surface-variant">Review completed certifications and upcoming eligibility milestones.</p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <article *ngFor="let certificate of certificates" class="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-on-surface">{{ certificate.name }}</h2>
              <p class="mt-2 text-sm text-on-surface-variant">{{ certificate.issued }}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
              [class.bg-tertiary-container]="certificate.status === 'Issued'"
              [class.text-on-tertiary-container]="certificate.status === 'Issued'"
              [class.bg-secondary-container]="certificate.status !== 'Issued'"
              [class.text-on-secondary-container]="certificate.status !== 'Issued'">
              {{ certificate.status }}
            </span>
          </div>
          <p class="mt-4 text-sm text-on-surface-variant">{{ certificate.note }}</p>
        </article>
      </div>
    </section>
  `
})
export class StudentCertificatesComponent {
  readonly certificates = [
    { name: 'Java Full Stack Certification', issued: 'Issued on 10 March 2026', status: 'Issued', note: 'Verified and ready for download from the student help desk.' },
    { name: 'SQL Assessment Badge', issued: 'Issued on 28 February 2026', status: 'Issued', note: 'Scored in the top 15% of the cohort.' },
    { name: 'Angular Project Completion', issued: 'Eligible after final review', status: 'Pending', note: 'Complete the capstone review to unlock this certificate.' }
  ];
}
