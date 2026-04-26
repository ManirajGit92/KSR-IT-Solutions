import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Plus, Search, Filter, Download, MoreVertical, UserCircle, X, Save, Trash2, Edit2, Globe, Mail, Briefcase } from 'lucide-angular';
import { FirebaseService, Trainer } from '../../../services/firebase.service';

@Component({
  selector: 'app-admin-trainers',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Trainers & Mentors</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage industry experts and their profiles.</p>
        </div>
        <div class="flex gap-3">
          <button (click)="openModal()" class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add Trainer
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="glass p-4 rounded-2xl border border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-grow w-full">
          <lucide-icon [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"></lucide-icon>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search trainers by name or skill..." 
                 class="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
        </div>
      </div>

      <!-- Trainers Grid -->
      <div *ngIf="loading" class="grid gap-6 xl:grid-cols-3">
        <div *ngFor="let i of [1,2,3]" class="glass p-6 rounded-2xl border border-outline-variant/10 flex flex-col items-center text-center animate-pulse">
           <div class="w-20 h-20 rounded-full bg-surface-container-high mb-4"></div>
           <div class="h-4 w-32 bg-surface-container-high rounded mb-2"></div>
           <div class="h-3 w-48 bg-surface-container-high rounded"></div>
        </div>
      </div>

      <div *ngIf="!loading" class="grid gap-6 xl:grid-cols-3">
        <div *ngFor="let trainer of filteredTrainers" class="glass p-6 rounded-3xl border border-outline-variant/10 flex flex-col group hover:border-primary/20 transition-all">
          <div class="flex items-start justify-between mb-6">
            <img [src]="trainer.imageUrl || 'https://via.placeholder.com/150'" class="w-20 h-20 rounded-2xl object-cover border border-outline-variant/10 shadow-sm" />
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="openModal(trainer)" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all">
                <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
              </button>
              <button (click)="deleteTrainer(trainer.id)" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-error/10 text-on-surface-variant hover:text-error transition-all">
                <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
          
          <h3 class="text-lg font-black text-on-surface">{{ trainer.name }}</h3>
          <p class="text-xs font-bold text-primary uppercase tracking-widest mb-4">{{ trainer.role }}</p>
          
          <p class="text-sm text-on-surface-variant line-clamp-2 mb-6 font-medium">{{ trainer.bio }}</p>
          
          <div class="mt-auto space-y-3">
            <div class="flex flex-wrap gap-1.5">
              <span *ngFor="let skill of trainer.specialization" class="px-2.5 py-1 bg-surface-container-high text-[10px] font-black uppercase tracking-widest rounded-md text-on-surface-variant">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trainer Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <div class="absolute inset-0 bg-surface/80 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="relative w-full max-w-2xl glass rounded-3xl border border-outline-variant/20 shadow-2xl animate-scale-in">
          <div class="p-6 flex items-center justify-between border-b border-outline-variant/10">
            <h2 class="text-xl font-bold text-on-surface">{{ editingTrainer ? 'Edit' : 'Add' }} Trainer</h2>
            <button (click)="closeModal()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <lucide-icon [img]="XIcon" class="w-5 h-5 text-on-surface-variant"></lucide-icon>
            </button>
          </div>

          <form [formGroup]="trainerForm" (ngSubmit)="saveTrainer()" class="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                <input formControlName="name" type="text" placeholder="e.g. John Doe" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Role / Title</label>
                <input formControlName="role" type="text" placeholder="e.g. Senior Data Engineer" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Image URL</label>
              <input formControlName="imageUrl" type="text" placeholder="https://..." class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Specializations (comma separated)</label>
              <input #skills (blur)="updateSkills(skills.value)" [value]="trainerForm.get('specialization')?.value?.join(', ')" type="text" placeholder="e.g. AWS, Python, SQL" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Biography</label>
              <textarea formControlName="bio" rows="4" placeholder="Brief professional background..." class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" (click)="closeModal()" class="px-6 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all">Cancel</button>
              <button type="submit" [disabled]="trainerForm.invalid" class="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50">
                <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon> {{ editingTrainer ? 'Update' : 'Save' }} Trainer
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
export class AdminTrainersComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private fb = inject(FormBuilder);

  readonly PlusIcon = Plus;
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly DownloadIcon = Download;
  readonly MoreVerticalIcon = MoreVertical;
  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly XIcon = X;
  readonly SaveIcon = Save;

  trainers: Trainer[] = [];
  loading = true;
  searchQuery = '';
  showModal = false;
  editingTrainer: Trainer | null = null;
  trainerForm: FormGroup;

  constructor() {
    this.trainerForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      bio: ['', Validators.required],
      imageUrl: ['', Validators.required],
      specialization: [[]]
    });
  }

  async ngOnInit() {
    await this.loadTrainers();
  }

  async loadTrainers() {
    this.loading = true;
    try {
      this.trainers = await this.firebaseService.getCollection<Trainer>('trainers');
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  get filteredTrainers() {
    return this.trainers.filter(t => 
      t.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      t.specialization.some(s => s.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  updateSkills(val: string) {
    const skills = val.split(',').map(s => s.trim()).filter(s => s !== '');
    this.trainerForm.patchValue({ specialization: skills });
  }

  openModal(trainer?: Trainer) {
    if (trainer) {
      this.editingTrainer = trainer;
      this.trainerForm.patchValue(trainer);
    } else {
      this.editingTrainer = null;
      this.trainerForm.reset({ specialization: [] });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async saveTrainer() {
    if (this.trainerForm.invalid) return;
    const data = this.trainerForm.value;
    try {
      if (this.editingTrainer) {
        await this.firebaseService.updateDocument('trainers', this.editingTrainer.id, data);
      } else {
        await this.firebaseService.addDocument('trainers', data);
      }
      await this.loadTrainers();
      this.closeModal();
    } catch (err) {
      alert('Failed to save trainer.');
    }
  }

  async deleteTrainer(id: string) {
    if (confirm('Delete this trainer profile?')) {
      try {
        await this.firebaseService.deleteDocument('trainers', id);
        await this.loadTrainers();
      } catch (err) {
        alert('Failed to delete trainer.');
      }
    }
  }
}
