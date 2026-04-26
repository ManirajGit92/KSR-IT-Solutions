import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../services/firebase.service';
import { LucideAngularModule, Calendar, BarChart, Star, IndianRupee } from 'lucide-angular';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './course-card.component.html'
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Output() enroll = new EventEmitter<Course>();

  readonly CalendarIcon = Calendar;
  readonly BarChartIcon = BarChart;
  readonly StarIcon = Star;
  readonly RupeeIcon = IndianRupee;
}
