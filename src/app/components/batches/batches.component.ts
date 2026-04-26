import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, Clock, Users, ArrowRight } from 'lucide-angular';
import { FirebaseService, Batch } from '../../services/firebase.service';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './batches.component.html'
})
export class BatchesComponent implements OnInit {
  @Input() content: any = {
    title: 'Upcoming <span class="text-gradient">Batches</span>',
    subtitle: 'Reserve your spot in our highly sought-after professional training programs.'
  };

  private firebaseService = inject(FirebaseService);
  batches: Batch[] = [];
  loading = true;

  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly UsersIcon = Users;
  readonly ArrowRightIcon = ArrowRight;

  async ngOnInit() {
    try {
      const allBatches = await this.firebaseService.getCollection<Batch>('batches');
      // Only show upcoming and ongoing batches
      this.batches = allBatches.filter(b => b.status !== 'Completed');
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'Upcoming': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'Ongoing': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  }
}
