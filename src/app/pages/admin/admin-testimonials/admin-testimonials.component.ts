import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Search, Filter, Download, Star } from 'lucide-angular';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Student Testimonials</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage success stories and reviews.</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add Testimonial
        </button>
      </div>

      <div class="glass p-4 rounded-2xl border border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-grow w-full">
          <lucide-icon [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"></lucide-icon>
          <input type="text" placeholder="Search by student or course..." 
                 class="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <div class="glass p-6 rounded-2xl border border-outline-variant/10 animate-pulse">
           <div class="flex items-center gap-4 mb-4">
             <div class="w-12 h-12 rounded-full bg-surface-container-high"></div>
             <div class="space-y-2">
               <div class="h-4 w-32 bg-surface-container-high rounded"></div>
               <div class="h-3 w-24 bg-surface-container-high rounded"></div>
             </div>
           </div>
           <div class="h-20 bg-surface-container-high rounded"></div>
        </div>
      </div>
    </section>
  `
})
export class AdminTestimonialsComponent {
  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly StarIcon = Star;
}
