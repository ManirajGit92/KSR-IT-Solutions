import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, Clock, Users, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './batches.component.html'
})
export class BatchesComponent {
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly UsersIcon = Users;
  readonly ArrowRightIcon = ArrowRight;

  batches = [
    { course: 'Full Stack Java', startDate: 'May 5, 2026', timing: 'Mon–Fri, 7:00 PM', seats: '12 seats left', mode: 'Online', status: 'Filling Fast', statusColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { course: 'Data Engineering', startDate: 'May 10, 2026', timing: 'Weekend, 10:00 AM', seats: '8 seats left', mode: 'Hybrid', status: 'Almost Full', statusColor: 'bg-red-500/10 text-red-600 dark:text-red-400' },
    { course: 'Angular & React', startDate: 'May 15, 2026', timing: 'Tue–Thu, 8:00 PM', seats: '20 seats left', mode: 'Online', status: 'Open', statusColor: 'bg-green-500/10 text-green-600 dark:text-green-400' },
    { course: 'Cloud & DevOps', startDate: 'June 1, 2026', timing: 'Weekend, 9:00 AM', seats: '15 seats left', mode: 'Online', status: 'Open', statusColor: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  ];
}
