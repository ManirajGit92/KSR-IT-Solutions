import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Filter } from 'lucide-angular';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Admin</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">User Management</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Track learner accounts, roles, and account health from one screen.</p>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <lucide-icon [img]="SearchIcon" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"></lucide-icon>
          <input type="text" placeholder="Search users..." 
                 class="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"/>
        </div>
        <button class="flex items-center gap-2 px-5 py-3 glass border border-outline-variant/20 rounded-xl text-sm font-bold text-on-surface-variant hover:border-primary/30 transition-all">
          <lucide-icon [img]="FilterIcon" class="w-4 h-4"></lucide-icon> Filter
        </button>
      </div>

      <!-- Users Table -->
      <div class="glass rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div class="hidden md:grid grid-cols-[1.5fr_1fr_1fr_0.5fr] gap-4 border-b border-outline-variant/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant bg-surface-container-lowest/50">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div *ngFor="let user of users; let i = index" 
             class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_0.5fr] gap-2 md:gap-4 px-6 py-5 text-sm text-on-surface border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-lowest/50 transition-colors animate-fade-in-up"
             [style.animation-delay]="i * 50 + 'ms'">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                 [ngClass]="user.role === 'Admin' ? 'bg-gradient-to-br from-violet-500 to-violet-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'">
              {{ user.name.charAt(0) }}
            </div>
            <div>
              <div class="font-bold text-on-surface">{{ user.name }}</div>
              <div class="text-xs text-on-surface-variant font-medium">{{ user.email }}</div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="px-3 py-1 rounded-lg text-xs font-bold"
                  [ngClass]="user.role === 'Admin' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'">
              {{ user.role }}
            </span>
          </div>
          <div class="flex items-center">
            <span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
              [ngClass]="user.status === 'Active' 
                ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'">
              {{ user.status }}
            </span>
          </div>
          <div class="flex items-center">
            <button class="text-xs font-bold text-primary hover:text-secondary transition-colors">Edit</button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminUsersComponent {
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;

  readonly users = [
    { name: 'Maniraj', email: 'manirajmca.ac@gmail.com', role: 'Admin', status: 'Active' },
    { name: 'Aarthi S', email: 'aarthi@example.com', role: 'Student', status: 'Active' },
    { name: 'Sanjay K', email: 'sanjay@example.com', role: 'Student', status: 'Pending' },
    { name: 'Lavanya P', email: 'lavanya@example.com', role: 'Student', status: 'Active' }
  ];
}
