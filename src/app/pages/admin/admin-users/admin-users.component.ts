import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-primary">Admin</p>
        <h1 class="mt-2 text-3xl font-black tracking-tight text-on-surface">Users</h1>
        <p class="mt-2 text-sm text-on-surface-variant">Track learner accounts, roles, and account health from one screen.</p>
      </div>

      <div class="overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-low">
        <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-outline-variant/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        <div *ngFor="let user of users" class="grid grid-cols-[1.5fr_1fr_1fr] gap-4 px-6 py-5 text-sm text-on-surface border-b border-outline-variant/10 last:border-b-0">
          <div>
            <div class="font-semibold">{{ user.name }}</div>
            <div class="text-xs text-on-surface-variant">{{ user.email }}</div>
          </div>
          <div>{{ user.role }}</div>
          <div>
            <span class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
              [class.bg-tertiary-container]="user.status === 'Active'"
              [class.text-on-tertiary-container]="user.status === 'Active'"
              [class.bg-secondary-container]="user.status !== 'Active'"
              [class.text-on-secondary-container]="user.status !== 'Active'">
              {{ user.status }}
            </span>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminUsersComponent {
  readonly users = [
    { name: 'Maniraj', email: 'manirajmca.ac@gmail.com', role: 'Admin', status: 'Active' },
    { name: 'Aarthi S', email: 'aarthi@example.com', role: 'Student', status: 'Active' },
    { name: 'Sanjay K', email: 'sanjay@example.com', role: 'Student', status: 'Pending' },
    { name: 'Lavanya P', email: 'lavanya@example.com', role: 'Student', status: 'Active' }
  ];
}
