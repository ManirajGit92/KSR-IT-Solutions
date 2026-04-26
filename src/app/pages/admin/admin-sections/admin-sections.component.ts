import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LucideAngularModule, GripVertical, Eye, EyeOff, Pencil, Plus, Trash2, Save, X } from 'lucide-angular';
import { FirebaseService, HomepageSection } from '../../../services/firebase.service';

@Component({
  selector: 'app-admin-sections',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DragDropModule, FormsModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Section Builder</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Drag to reorder, toggle visibility, and edit homepage sections.</p>
        </div>
        <button (click)="addSection()" class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add Section
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let i of [1,2,3,4]" class="glass h-20 rounded-2xl animate-pulse bg-surface-container-low"></div>
      </div>

      <!-- Sortable Section List -->
      <div *ngIf="!loading" cdkDropList (cdkDropListDropped)="drop($event)" class="space-y-3">
        <article *ngFor="let section of sections; let i = index" 
                 cdkDrag
                 class="group glass rounded-2xl border border-outline-variant/10 hover:border-primary/20 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-4 animate-fade-in-up"
                 [style.animation-delay]="i * 100 + 'ms'">
          
          <div *cdkDragPlaceholder class="glass rounded-2xl border border-primary/20 bg-primary/5 h-20 w-full"></div>

          <!-- Drag Handle -->
          <div cdkDragHandle class="cursor-grab text-on-surface-variant/40 hover:text-on-surface-variant transition-colors flex-shrink-0">
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
                    [ngClass]="section.visible 
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                      : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'">
                {{ section.visible ? 'Published' : 'Hidden' }}
              </span>
              <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50">Type: {{ section.type }}</span>
            </div>
            <p class="mt-1 text-sm text-on-surface-variant font-medium truncate">{{ section.id }}</p>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button (click)="openEditModal(section)" class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all" title="Edit Content">
              <lucide-icon [img]="PencilIcon" class="w-4 h-4"></lucide-icon>
            </button>
            <button (click)="toggleVisibility(section)" class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all" 
                    [title]="section.visible ? 'Hide' : 'Show'">
              <lucide-icon [img]="EyeIcon" class="w-4 h-4"></lucide-icon>
            </button>
            <button (click)="deleteSection(section.id)" class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-error transition-all" title="Delete">
              <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </article>
      </div>

      <!-- Edit Content Modal -->
      <div *ngIf="showEditModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <div class="absolute inset-0 bg-surface/80 backdrop-blur-sm" (click)="closeEditModal()"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-outline-variant/20 shadow-2xl animate-scale-in">
          <div class="sticky top-0 z-10 glass border-b border-outline-variant/10 p-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-on-surface">Edit Section: {{ editingSection?.name }}</h2>
            <button (click)="closeEditModal()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <lucide-icon [img]="XIcon" class="w-5 h-5 text-on-surface-variant"></lucide-icon>
            </button>
          </div>

          <div class="p-6 space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Section Content (JSON)</label>
              <textarea [(ngModel)]="editContentJson" rows="15" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"></textarea>
              <p *ngIf="jsonError" class="text-error text-xs font-bold">{{ jsonError }}</p>
            </div>

            <div class="flex justify-end gap-4 pt-6 border-t border-outline-variant/10">
              <button (click)="closeEditModal()" class="px-6 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all">Cancel</button>
              <button (click)="saveSectionContent()" class="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon> Save Content
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Order Hint -->
      <div *ngIf="orderChanged" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
        <button (click)="saveOrder()" class="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-black text-sm shadow-2xl shadow-primary/40 hover:scale-105 transition-all">
          <lucide-icon [img]="SaveIcon" class="w-5 h-5"></lucide-icon> Save New Order
        </button>
      </div>
    </section>
  `
})
export class AdminSectionsComponent implements OnInit {
  private firebaseService = inject(FirebaseService);

  readonly GripVerticalIcon = GripVertical;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly PencilIcon = Pencil;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash2;
  readonly SaveIcon = Save;
  readonly XIcon = X;

  sections: HomepageSection[] = [];
  loading = true;
  orderChanged = false;

  showEditModal = false;
  editingSection: HomepageSection | null = null;
  editContentJson = '';
  jsonError = '';

  async ngOnInit() {
    await this.loadSections();
  }

  async loadSections() {
    this.loading = true;
    this.sections = await this.firebaseService.getCollection<HomepageSection>('homepage_sections');
    this.loading = false;
  }

  drop(event: CdkDragDrop<HomepageSection[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    this.orderChanged = true;
  }

  async saveOrder() {
    this.loading = true;
    const batch = this.sections.map((s, i) => ({ ...s, order: i }));
    for (const section of batch) {
      await this.firebaseService.updateDocument('homepage_sections', section.id, { order: section.order });
    }
    this.orderChanged = false;
    await this.loadSections();
  }

  async toggleVisibility(section: HomepageSection) {
    await this.firebaseService.updateDocument('homepage_sections', section.id, { visible: !section.visible });
    await this.loadSections();
  }

  openEditModal(section: HomepageSection) {
    this.editingSection = section;
    this.editContentJson = JSON.stringify(section.content || {}, null, 2);
    this.jsonError = '';
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  async saveSectionContent() {
    try {
      const content = JSON.parse(this.editContentJson);
      if (this.editingSection) {
        await this.firebaseService.updateDocument('homepage_sections', this.editingSection.id, { content });
        this.closeEditModal();
        await this.loadSections();
      }
    } catch (e) {
      this.jsonError = 'Invalid JSON format. Please check your syntax.';
    }
  }

  async addSection() {
    const name = prompt('Section Name:');
    const type = prompt('Section Type (hero, about, courses, testimonials, etc.):');
    if (name && type) {
      await this.firebaseService.addDocument('homepage_sections', {
        name,
        type,
        order: this.sections.length,
        visible: true,
        content: {}
      });
      await this.loadSections();
    }
  }

  async deleteSection(id: string) {
    if (confirm('Are you sure you want to delete this section?')) {
      await this.firebaseService.deleteDocument('homepage_sections', id);
      await this.loadSections();
    }
  }
}
