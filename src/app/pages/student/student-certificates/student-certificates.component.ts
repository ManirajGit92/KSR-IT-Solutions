import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Award, Download, ExternalLink } from 'lucide-angular';

@Component({
  selector: 'app-student-certificates',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Student Portal</p>
        <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">My Certificates</h1>
        <p class="mt-2 text-sm text-on-surface-variant font-medium">Review completed certifications and upcoming eligibility milestones.</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <article *ngFor="let certificate of certificates; let i = index" 
                 class="group glass rounded-2xl border border-outline-variant/10 hover:border-primary/20 p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden relative animate-fade-in-up"
                 [style.animation-delay]="i * 100 + 'ms'">
          <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity"
               [ngClass]="certificate.status === 'Issued' ? 'from-green-500/3 to-transparent' : 'from-amber-500/3 to-transparent'"></div>
          
          <div class="relative z-10">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                     [ngClass]="certificate.status === 'Issued' 
                       ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                       : 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white'">
                  <lucide-icon [img]="AwardIcon" class="w-6 h-6"></lucide-icon>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{{ certificate.name }}</h2>
                  <p class="mt-1 text-sm text-on-surface-variant font-medium">{{ certificate.issued }}</p>
                </div>
              </div>
              <span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap flex-shrink-0"
                [ngClass]="certificate.status === 'Issued' 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'">
                {{ certificate.status }}
              </span>
            </div>
            
            <p class="mt-4 text-sm text-on-surface-variant font-medium">{{ certificate.note }}</p>
            
            <div class="mt-5 pt-4 border-t border-outline-variant/20 flex items-center gap-3">
              <button *ngIf="certificate.status === 'Issued'"
                      class="flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors">
                <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon> Download
              </button>
              <button *ngIf="certificate.status === 'Issued'"
                      class="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
                <lucide-icon [img]="ExternalLinkIcon" class="w-4 h-4"></lucide-icon> Verify
              </button>
              <span *ngIf="certificate.status !== 'Issued'" class="text-sm font-medium text-on-surface-variant italic">
                Complete requirements to unlock
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  `
})
export class StudentCertificatesComponent {
  readonly AwardIcon = Award;
  readonly DownloadIcon = Download;
  readonly ExternalLinkIcon = ExternalLink;

  readonly certificates = [
    { name: 'Java Full Stack Certification', issued: 'Issued on 10 March 2026', status: 'Issued', note: 'Verified and ready for download from the student help desk.' },
    { name: 'SQL Assessment Badge', issued: 'Issued on 28 February 2026', status: 'Issued', note: 'Scored in the top 15% of the cohort.' },
    { name: 'Angular Project Completion', issued: 'Eligible after final review', status: 'Pending', note: 'Complete the capstone review to unlock this certificate.' }
  ];
}
