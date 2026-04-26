import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, HelpCircle, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-admin-faqs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Common FAQs</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage frequently asked questions for courses and platform.</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add FAQ
        </button>
      </div>

      <div class="space-y-4">
        <div *ngFor="let i of [1,2,3,4]" class="glass p-6 rounded-2xl border border-outline-variant/10 animate-pulse">
          <div class="flex items-center justify-between">
            <div class="h-4 w-2/3 bg-surface-container-high rounded"></div>
            <div class="h-6 w-6 bg-surface-container-high rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminFaqsComponent {
  readonly PlusIcon = Plus;
  readonly HelpCircleIcon = HelpCircle;
}
