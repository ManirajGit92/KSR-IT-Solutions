import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MessageSquare, Mail, Phone, Clock } from 'lucide-angular';

@Component({
  selector: 'app-admin-enquiries',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Course Enquiries</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Track and respond to student enquiries.</p>
        </div>
      </div>

      <div class="grid gap-4">
        <div *ngFor="let i of [1,2,3]" class="glass p-6 rounded-2xl border border-outline-variant/10 flex flex-col md:flex-row justify-between gap-6 animate-pulse">
          <div class="space-y-3 flex-1">
            <div class="h-5 w-48 bg-surface-container-high rounded"></div>
            <div class="flex gap-4">
              <div class="h-3 w-32 bg-surface-container-high rounded"></div>
              <div class="h-3 w-32 bg-surface-container-high rounded"></div>
            </div>
            <div class="h-10 bg-surface-container-high rounded"></div>
          </div>
          <div class="w-32 h-10 bg-surface-container-high rounded-xl self-center"></div>
        </div>
      </div>
    </section>
  `
})
export class AdminEnquiriesComponent {
  readonly MessageSquareIcon = MessageSquare;
}
