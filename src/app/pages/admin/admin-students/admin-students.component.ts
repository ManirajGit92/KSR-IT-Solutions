import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, GraduationCap, Mail, Phone, BookOpen } from 'lucide-angular';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Registered Students</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage student records and course enrollments.</p>
        </div>
      </div>

      <div class="glass p-6 rounded-2xl border border-outline-variant/10 overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">
              <th class="pb-4">Student</th>
              <th class="pb-4">Email</th>
              <th class="pb-4">Courses</th>
              <th class="pb-4">Joined</th>
              <th class="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="animate-pulse">
            <tr *ngFor="let i of [1,2,3,4,5]" class="border-b border-outline-variant/5">
              <td class="py-4 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-surface-container-high"></div>
                <div class="h-4 w-32 bg-surface-container-high rounded"></div>
              </td>
              <td class="py-4"><div class="h-4 w-40 bg-surface-container-high rounded"></div></td>
              <td class="py-4"><div class="h-4 w-10 bg-surface-container-high rounded"></div></td>
              <td class="py-4"><div class="h-4 w-24 bg-surface-container-high rounded"></div></td>
              <td class="py-4 text-right"><div class="h-8 w-8 bg-surface-container-high rounded ml-auto"></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class AdminStudentsComponent {
  readonly GraduationCapIcon = GraduationCap;
}
