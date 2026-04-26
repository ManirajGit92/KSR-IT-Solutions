import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Plus, HelpCircle, ChevronDown, Edit2, Trash2, X, Save, Search } from 'lucide-angular';
import { FirebaseService, FAQ } from '../../../services/firebase.service';

@Component({
  selector: 'app-admin-faqs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Common FAQs</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage frequently asked questions for courses and platform.</p>
        </div>
        <button (click)="openModal()" class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add FAQ
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <lucide-icon [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"></lucide-icon>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search questions..." 
                 class="w-full bg-surface-container/50 border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
        </div>
      </div>

      <!-- FAQ List -->
      <div class="space-y-4">
        <div *ngIf="loading" class="text-center py-12">
          <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Loading FAQs...</p>
        </div>

        <div *ngIf="!loading && filteredFaqs.length === 0" class="glass p-12 rounded-3xl border border-outline-variant/10 text-center">
          <lucide-icon [img]="HelpCircleIcon" class="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4"></lucide-icon>
          <p class="text-on-surface-variant font-medium">No FAQs found matching your search.</p>
        </div>

        <div *ngFor="let faq of filteredFaqs" class="glass rounded-3xl border border-outline-variant/10 overflow-hidden group">
          <div class="p-6 flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">
                  {{ faq.category || 'General' }}
                </span>
              </div>
              <h3 class="text-lg font-bold text-on-surface">{{ faq.question }}</h3>
              <p class="mt-3 text-sm text-on-surface-variant leading-relaxed">{{ faq.answer }}</p>
            </div>
            <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="openModal(faq)" class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all">
                <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
              </button>
              <button (click)="deleteFaq(faq.id)" class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-error/10 text-on-surface-variant hover:text-error transition-all">
                <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <div class="absolute inset-0 bg-surface/80 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="relative w-full max-w-2xl glass rounded-3xl border border-outline-variant/20 shadow-2xl animate-scale-in">
          <div class="p-6 flex items-center justify-between border-b border-outline-variant/10">
            <h2 class="text-xl font-bold text-on-surface">{{ editingFaq ? 'Edit' : 'Add' }} FAQ</h2>
            <button (click)="closeModal()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <lucide-icon [img]="XIcon" class="w-5 h-5 text-on-surface-variant"></lucide-icon>
            </button>
          </div>

          <form [formGroup]="faqForm" (ngSubmit)="saveFaq()" class="p-6 space-y-5">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Category</label>
              <select formControlName="category" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
                <option value="General">General</option>
                <option value="Course">Course</option>
                <option value="Placement">Placement</option>
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Question</label>
              <input formControlName="question" type="text" placeholder="e.g. What is the duration of the course?" 
                     class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Answer</label>
              <textarea formControlName="answer" rows="5" placeholder="Provide a detailed answer..." 
                        class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" (click)="closeModal()" class="px-6 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all">Cancel</button>
              <button type="submit" [disabled]="faqForm.invalid" class="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50">
                <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon> {{ editingFaq ? 'Update' : 'Save' }} FAQ
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class AdminFaqsComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private fb = inject(FormBuilder);

  readonly PlusIcon = Plus;
  readonly HelpCircleIcon = HelpCircle;
  readonly SearchIcon = Search;
  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly XIcon = X;
  readonly SaveIcon = Save;

  faqs: FAQ[] = [];
  loading = true;
  searchQuery = '';
  showModal = false;
  editingFaq: FAQ | null = null;
  faqForm: FormGroup;

  constructor() {
    this.faqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      category: ['General', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadFaqs();
  }

  async loadFaqs() {
    this.loading = true;
    try {
      this.faqs = await this.firebaseService.getCollection<FAQ>('faqs');
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  get filteredFaqs() {
    return this.faqs.filter(f => 
      f.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openModal(faq?: FAQ) {
    if (faq) {
      this.editingFaq = faq;
      this.faqForm.patchValue(faq);
    } else {
      this.editingFaq = null;
      this.faqForm.reset({ category: 'General' });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async saveFaq() {
    if (this.faqForm.invalid) return;
    const data = this.faqForm.value;
    try {
      if (this.editingFaq) {
        await this.firebaseService.updateDocument('faqs', this.editingFaq.id, data);
      } else {
        await this.firebaseService.addDocument('faqs', data);
      }
      await this.loadFaqs();
      this.closeModal();
    } catch (err) {
      alert('Failed to save FAQ.');
    }
  }

  async deleteFaq(id: string) {
    if (confirm('Delete this FAQ?')) {
      try {
        await this.firebaseService.deleteDocument('faqs', id);
        await this.loadFaqs();
      } catch (err) {
        alert('Failed to delete FAQ.');
      }
    }
  }
}
