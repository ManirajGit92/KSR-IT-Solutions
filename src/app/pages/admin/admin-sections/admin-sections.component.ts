import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, GripVertical, Eye, EyeOff, Pencil, Plus } from 'lucide-angular';

@Component({
  selector: 'app-admin-sections',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Section Builder</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Drag to reorder, toggle visibility, and edit homepage sections.</p>
        </div>
        <button class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add Section
        </button>
      </div>

      <!-- Sortable Section List -->
      <div class="space-y-3">
        <article *ngFor="let section of sections; let i = index" 
                 class="group glass rounded-2xl border border-outline-variant/10 hover:border-primary/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-4 animate-fade-in-up"
                 [style.animation-delay]="i * 100 + 'ms'">
          
          <!-- Drag Handle -->
          <div class="cursor-grab text-on-surface-variant/40 hover:text-on-surface-variant transition-colors flex-shrink-0">
            <lucide-icon [img]="GripVerticalIcon" class="w-5 h-5"></lucide-icon>
          </div>
          
          <!-- Order Number -->
          <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-xs font-black text-on-surface-variant flex-shrink-0">
            {{ i + 1 }}
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3">
              <h2 class="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">{{ section.name }}</h2>
              <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap flex-shrink-0"
                    [ngClass]="section.state === 'Published' 
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                      : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'">
                {{ section.state }}
              </span>
            </div>
            <p class="mt-1 text-sm text-on-surface-variant font-medium truncate">{{ section.description }}</p>
            <div class="mt-2 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/70 font-bold">Updated {{ section.updatedAt }}</div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all" title="Edit">
              <lucide-icon [img]="PencilIcon" class="w-4 h-4"></lucide-icon>
            </button>
            <button class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all" 
                    [title]="section.state === 'Published' ? 'Hide' : 'Show'">
              <lucide-icon [img]="section.state === 'Published' ? EyeIcon : EyeOffIcon" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </article>
      </div>
    </section>
  `
})
export class AdminSectionsComponent {
  readonly GripVerticalIcon = GripVertical;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly PencilIcon = Pencil;
  readonly PlusIcon = Plus;

  readonly sections = [
    { name: 'Hero Banner', state: 'Published', description: 'Top-level campaign message and CTA buttons.', updatedAt: '2 days ago' },
    { name: 'Core Competencies', state: 'Published', description: 'Technology skills grid with icons.', updatedAt: 'Today' },
    { name: 'Featured Courses', state: 'Published', description: 'Featured programs shown on the landing page.', updatedAt: 'Today' },
    { name: 'Why Choose Us', state: 'Published', description: 'Key benefits and differentiators.', updatedAt: '1 day ago' },
    { name: 'Our Mission', state: 'Published', description: 'Brand mission statement and call to action.', updatedAt: '3 days ago' },
    { name: 'Testimonials', state: 'Needs review', description: 'Student success stories waiting for fresh copy.', updatedAt: '4 days ago' },
    { name: 'Contact Form', state: 'Published', description: 'Enquiry form with email and phone details.', updatedAt: '1 week ago' }
  ];
}
