import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, GraduationCap, Mail, Phone, BookOpen, Search, User, Calendar, MoreVertical, Trash2, ShieldCheck, Clock } from 'lucide-angular';
import { FirebaseService, Student } from '../../../services/firebase.service';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Registered Students</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage student records and course enrollments.</p>
        </div>
      </div>

      <!-- Search & Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 glass p-4 rounded-2xl border border-outline-variant/10 flex items-center">
          <lucide-icon [img]="SearchIcon" class="ml-4 w-4 h-4 text-on-surface-variant"></lucide-icon>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search by name, email or phone..." 
                 class="w-full bg-transparent border-none px-4 py-2 focus:outline-none text-sm font-medium">
        </div>
        <div class="glass p-4 rounded-2xl border border-outline-variant/10 flex items-center justify-between px-6">
          <div class="text-xs font-black uppercase tracking-widest text-on-surface-variant">Total Students</div>
          <div class="text-2xl font-black text-primary">{{ students.length }}</div>
        </div>
      </div>

      <div class="glass rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10 bg-surface-container-low/50">
                <th class="px-6 py-5">Student Profile</th>
                <th class="px-6 py-5">Contact Details</th>
                <th class="px-6 py-5">Enrolled Courses</th>
                <th class="px-6 py-5">Joined Date</th>
                <th class="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="loading" class="animate-pulse">
                <td colspan="5" class="p-20 text-center">
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Fetching student records...</p>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!loading && filteredStudents.length === 0">
                <td colspan="5" class="p-20 text-center">
                  <lucide-icon [img]="UserIcon" class="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4"></lucide-icon>
                  <p class="text-on-surface-variant font-medium">No students found matching your search.</p>
                </td>
              </tr>
              <tr *ngFor="let student of filteredStudents" class="border-b border-outline-variant/5 hover:bg-surface-container-low/30 transition-colors group">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm">
                      {{ student.name.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-on-surface">{{ student.name }}</div>
                      <div class="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-medium mt-0.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active Student
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 text-xs text-on-surface-variant font-medium hover:text-primary transition-colors cursor-pointer">
                      <lucide-icon [img]="MailIcon" class="w-3.5 h-3.5"></lucide-icon> {{ student.email }}
                    </div>
                    <div class="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                      <lucide-icon [img]="PhoneIcon" class="w-3.5 h-3.5"></lucide-icon> {{ student.phone || 'No phone' }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-wrap gap-1.5 max-w-[200px]">
                    <span *ngFor="let courseId of student.enrolledCourses" class="px-2 py-0.5 bg-surface-container-high text-[10px] font-bold text-on-surface-variant rounded border border-outline-variant/10">
                      {{ courseId }}
                    </span>
                    <span *ngIf="student.enrolledCourses.length === 0" class="text-[10px] text-on-surface-variant italic opacity-50">No enrollments</span>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                    <lucide-icon [img]="CalendarIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ student.joinedDate | date:'MMM d, y' }}
                  </div>
                </td>
                <td class="px-6 py-5 text-right">
                  <button (click)="deleteStudent(student.id)" class="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-error/10 text-on-surface-variant hover:text-error transition-all opacity-0 group-hover:opacity-100">
                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
})
export class AdminStudentsComponent implements OnInit {
  private firebaseService = inject(FirebaseService);

  readonly GraduationCapIcon = GraduationCap;
  readonly MailIcon = Mail;
  readonly PhoneIcon = Phone;
  readonly BookOpenIcon = BookOpen;
  readonly SearchIcon = Search;
  readonly UserIcon = User;
  readonly CalendarIcon = Calendar;
  readonly TrashIcon = Trash2;

  students: Student[] = [];
  loading = true;
  searchQuery = '';

  async ngOnInit() {
    await this.loadStudents();
  }

  async loadStudents() {
    this.loading = true;
    try {
      // In our architecture, students are users with role='student'
      // But we might have a dedicated 'students' collection for full records
      const allUsers = await this.firebaseService.getCollection<any>('users');
      this.students = allUsers
        .filter(u => u.role === 'student' || !u.role) // Default to student if no role
        .map(u => ({
          id: u.id,
          name: u.displayName || u.name || 'Anonymous',
          email: u.email,
          phone: u.phone || '',
          enrolledCourses: u.enrolledCourses || [],
          joinedDate: u.joinedDate || new Date().toISOString(),
          status: 'Active'
        }));
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  get filteredStudents() {
    return this.students.filter(s => 
      s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.phone.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  async deleteStudent(id: string) {
    if (confirm('Are you sure you want to remove this student record? This will not delete their authentication account.')) {
      try {
        await this.firebaseService.deleteDocument('users', id);
        await this.loadStudents();
      } catch (err) {
        alert('Failed to delete student record.');
      }
    }
  }
}
