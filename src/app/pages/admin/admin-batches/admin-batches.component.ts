import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Plus, Calendar, Clock, Tag, X, Save, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-angular';
import { FirebaseService, Batch, Course } from '../../../services/firebase.service';

@Component({
  selector: 'app-admin-batches',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Batch Management</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Schedule and track upcoming and ongoing training batches.</p>
        </div>
        <button (click)="openModal()" class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Schedule Batch
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="glass p-6 rounded-2xl border border-outline-variant/10">
          <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Upcoming</p>
          <p class="text-2xl font-black text-primary">{{ getCount('Upcoming') }}</p>
        </div>
        <div class="glass p-6 rounded-2xl border border-outline-variant/10">
          <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Ongoing</p>
          <p class="text-2xl font-black text-secondary">{{ getCount('Ongoing') }}</p>
        </div>
        <div class="glass p-6 rounded-2xl border border-outline-variant/10">
          <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Completed</p>
          <p class="text-2xl font-black text-on-surface-variant">{{ getCount('Completed') }}</p>
        </div>
      </div>

      <div class="glass rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10 bg-surface-container-low/50">
                <th class="px-6 py-4">Course</th>
                <th class="px-6 py-4">Timing</th>
                <th class="px-6 py-4">Start Date</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="loading" class="animate-pulse">
                <td colspan="5" class="p-12 text-center text-on-surface-variant font-bold uppercase tracking-widest text-xs">Loading data...</td>
              </tr>
              <tr *ngIf="!loading && batches.length === 0">
                <td colspan="5" class="p-12 text-center text-on-surface-variant">No batches scheduled yet.</td>
              </tr>
              <tr *ngFor="let batch of batches" class="border-b border-outline-variant/5 hover:bg-surface-container-low/30 transition-colors group">
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-on-surface">{{ batch.courseTitle }}</div>
                  <div class="text-[10px] text-on-surface-variant font-medium">{{ batch.days }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                    <lucide-icon [img]="ClockIcon" class="w-3 h-3"></lucide-icon>
                    {{ batch.timing }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                    <lucide-icon [img]="CalendarIcon" class="w-3 h-3"></lucide-icon>
                    {{ batch.startDate }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span [class]="'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ' + getStatusClass(batch.status)">
                    {{ batch.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="openModal(batch)" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all">
                      <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button (click)="deleteBatch(batch.id)" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-error/10 text-on-surface-variant hover:text-error transition-all">
                      <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Batch Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <div class="absolute inset-0 bg-surface/80 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="relative w-full max-w-lg glass rounded-3xl border border-outline-variant/20 shadow-2xl animate-scale-in">
          <div class="p-6 flex items-center justify-between border-b border-outline-variant/10">
            <h2 class="text-xl font-bold text-on-surface">{{ editingBatch ? 'Edit' : 'Schedule' }} Batch</h2>
            <button (click)="closeModal()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <lucide-icon [img]="XIcon" class="w-5 h-5 text-on-surface-variant"></lucide-icon>
            </button>
          </div>

          <form [formGroup]="batchForm" (ngSubmit)="saveBatch()" class="p-6 space-y-5">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Select Course</label>
              <select formControlName="courseId" (change)="onCourseChange($event)" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
                <option value="">Choose a course...</option>
                <option *ngFor="let course of courses" [value]="course.id">{{ course.title }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Timing</label>
                <input formControlName="timing" type="text" placeholder="e.g. 7:00 PM" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Start Date</label>
                <input formControlName="startDate" type="date" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Days</label>
                <input formControlName="days" type="text" placeholder="e.g. Mon - Fri" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Status</label>
                <select formControlName="status" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" (click)="closeModal()" class="px-6 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all">Cancel</button>
              <button type="submit" [disabled]="batchForm.invalid" class="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50">
                <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon> {{ editingBatch ? 'Update' : 'Schedule' }}
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
export class AdminBatchesComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private fb = inject(FormBuilder);

  readonly PlusIcon = Plus;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly TagIcon = Tag;
  readonly XIcon = X;
  readonly SaveIcon = Save;
  readonly TrashIcon = Trash2;
  readonly EditIcon = Edit2;

  batches: Batch[] = [];
  courses: Course[] = [];
  loading = true;
  showModal = false;
  editingBatch: Batch | null = null;
  batchForm: FormGroup;

  constructor() {
    this.batchForm = this.fb.group({
      courseId: ['', Validators.required],
      courseTitle: ['', Validators.required],
      timing: ['', Validators.required],
      days: ['', Validators.required],
      startDate: ['', Validators.required],
      status: ['Upcoming', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      this.batches = await this.firebaseService.getCollection<Batch>('batches');
      this.courses = await this.firebaseService.getCourses();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  getCount(status: string) {
    return this.batches.filter(b => b.status === status).length;
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Upcoming': return 'bg-primary/10 text-primary';
      case 'Ongoing': return 'bg-secondary/10 text-secondary';
      case 'Completed': return 'bg-surface-container-high text-on-surface-variant';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  }

  onCourseChange(event: any) {
    const courseId = event.target.value;
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      this.batchForm.patchValue({ courseTitle: course.title });
    }
  }

  openModal(batch?: Batch) {
    if (batch) {
      this.editingBatch = batch;
      this.batchForm.patchValue(batch);
    } else {
      this.editingBatch = null;
      this.batchForm.reset({ status: 'Upcoming' });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async saveBatch() {
    if (this.batchForm.invalid) return;

    const data = this.batchForm.value;
    try {
      if (this.editingBatch) {
        await this.firebaseService.updateDocument('batches', this.editingBatch.id, data);
      } else {
        await this.firebaseService.addDocument('batches', data);
      }
      await this.loadData();
      this.closeModal();
    } catch (err) {
      alert('Failed to save batch. Please check console.');
    }
  }

  async deleteBatch(id: string) {
    if (confirm('Are you sure you want to delete this batch?')) {
      try {
        await this.firebaseService.deleteDocument('batches', id);
        await this.loadData();
      } catch (err) {
        alert('Failed to delete batch.');
      }
    }
  }
}
