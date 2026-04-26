import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Calendar, Clock, Tag } from 'lucide-angular';

@Component({
  selector: 'app-admin-batches',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Batch Management</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Schedule and track upcoming and ongoing training batches.</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Schedule Batch
        </button>
      </div>

      <div class="glass p-6 rounded-2xl border border-outline-variant/10 overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">
              <th class="pb-4">Course</th>
              <th class="pb-4">Timing</th>
              <th class="pb-4">Start Date</th>
              <th class="pb-4">Status</th>
              <th class="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="animate-pulse">
            <tr *ngFor="let i of [1,2,3,4,5]" class="border-b border-outline-variant/5">
              <td class="py-4"><div class="h-4 w-40 bg-surface-container-high rounded"></div></td>
              <td class="py-4"><div class="h-4 w-32 bg-surface-container-high rounded"></div></td>
              <td class="py-4"><div class="h-4 w-24 bg-surface-container-high rounded"></div></td>
              <td class="py-4"><div class="h-6 w-20 bg-surface-container-high rounded-full"></div></td>
              <td class="py-4 text-right"><div class="h-8 w-8 bg-surface-container-high rounded ml-auto"></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class AdminBatchesComponent {
  readonly PlusIcon = Plus;
  readonly CalendarIcon = Calendar;
}
