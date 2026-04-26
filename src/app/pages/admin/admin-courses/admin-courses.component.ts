import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Plus, MoreVertical, Users, GraduationCap, X, Upload, Save, Trash2, Download } from 'lucide-angular';
import { FirebaseService, Course } from '../../../services/firebase.service';
import { StorageService } from '../../../services/storage.service';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Course Management</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage published programs, mentors, and current intake status.</p>
        </div>
        <div class="flex gap-3">
          <button (click)="exportCourses()" class="flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl font-bold text-sm border border-outline-variant/10 hover:border-primary/20 transition-all">
            <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon> Export
          </button>
          <button (click)="openModal()" class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add Course
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid gap-6 xl:grid-cols-3">
        <div *ngFor="let i of [1,2,3]" class="glass h-64 rounded-2xl animate-pulse bg-surface-container-low"></div>
      </div>

      <!-- Courses Grid -->
      <div *ngIf="!loading" class="grid gap-6 xl:grid-cols-3">
        <article *ngFor="let course of courses; let i = index" 
                 class="group glass rounded-2xl border border-outline-variant/10 hover:border-primary/20 p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl overflow-hidden relative animate-fade-in-up"
                 [style.animation-delay]="i * 100 + 'ms'">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="relative z-10">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{{ course.title }}</h2>
                <p class="mt-2 text-sm text-on-surface-variant font-medium line-clamp-2">{{ course.description }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button (click)="openModal(course)" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant transition-colors">
                  <lucide-icon [img]="MoreVerticalIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>
            
            <div class="mt-6 grid grid-cols-2 gap-3">
              <div class="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/10">
                <div class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-2">
                  <lucide-icon [img]="UsersIcon" class="w-3.5 h-3.5"></lucide-icon> Level
                </div>
                <div class="text-lg font-black text-on-surface">{{ course.level }}</div>
              </div>
              <div class="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/10">
                <div class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-2">
                  <lucide-icon [img]="GraduationCapIcon" class="w-3.5 h-3.5"></lucide-icon> Duration
                </div>
                <div class="text-lg font-bold text-on-surface">{{ course.duration }}</div>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
               <button (click)="deleteCourse(course.id)" class="text-error text-xs font-bold uppercase tracking-widest hover:underline">Delete</button>
            </div>
          </div>
        </article>
      </div>

      <!-- Course Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <div class="absolute inset-0 bg-surface/80 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-outline-variant/20 shadow-2xl animate-scale-in">
          <div class="sticky top-0 z-10 glass border-b border-outline-variant/10 p-6 flex items-center justify-between">
            <h2 class="text-xl font-bold text-on-surface">{{ editingCourse ? 'Edit' : 'Add' }} Course</h2>
            <button (click)="closeModal()" class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <lucide-icon [img]="XIcon" class="w-5 h-5 text-on-surface-variant"></lucide-icon>
            </button>
          </div>

          <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="p-6 space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Course Title</label>
                <input formControlName="title" type="text" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Slug (URL)</label>
                <input formControlName="slug" type="text" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Short Description</label>
              <textarea formControlName="description" rows="3" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"></textarea>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Duration</label>
                <input formControlName="duration" type="text" placeholder="e.g. 3 Months" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Level</label>
                <select formControlName="level" class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Image URL</label>
              <div class="flex gap-4">
                <input formControlName="imageUrl" type="text" class="flex-grow bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                <button type="button" class="px-4 bg-secondary/10 text-secondary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary/20 transition-all">
                  <lucide-icon [img]="UploadIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-4 pt-6 border-t border-outline-variant/10">
              <button type="button" (click)="closeModal()" class="px-6 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all">Cancel</button>
              <button type="submit" [disabled]="courseForm.invalid" class="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50">
                <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon> Save Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `
})
export class AdminCoursesComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private fb = inject(FormBuilder);
  private exportService = inject(ExportService);
  
  readonly PlusIcon = Plus;
  readonly MoreVerticalIcon = MoreVertical;
  readonly UsersIcon = Users;
  readonly GraduationCapIcon = GraduationCap;
  readonly XIcon = X;
  readonly UploadIcon = Upload;
  readonly SaveIcon = Save;
  readonly TrashIcon = Trash2;
  readonly DownloadIcon = Download;

  courses: Course[] = [];
  loading = true;
  showModal = false;
  editingCourse: Course | null = null;
  courseForm: FormGroup;

  constructor() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      level: ['Beginner', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadCourses();
  }

  async loadCourses() {
    this.loading = true;
    this.courses = await this.firebaseService.getCourses();
    this.loading = false;
  }

  openModal(course?: Course) {
    if (course) {
      this.editingCourse = course;
      this.courseForm.patchValue(course);
    } else {
      this.editingCourse = null;
      this.courseForm.reset({ level: 'Beginner' });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async saveCourse() {
    if (this.courseForm.invalid) return;

    const data = this.courseForm.value;
    if (this.editingCourse) {
      await this.firebaseService.updateDocument('courses', this.editingCourse.id, data);
    } else {
      await this.firebaseService.addDocument('courses', data);
    }

    this.closeModal();
    await this.loadCourses();
  }

  async deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      await this.firebaseService.deleteDocument('courses', id);
      await this.loadCourses();
    }
  }

  async exportCourses() {
    this.exportService.exportToCsv('courses.csv', this.courses);
  }
}
