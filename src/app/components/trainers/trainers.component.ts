import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Linkedin, Star } from 'lucide-angular';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './trainers.component.html',
})
export class TrainersComponent {
  @Input() content: any = {
    title: 'Learn From the <span class="text-gradient">Best</span>',
    subtitle:
      'Our instructors are veteran MNC professionals with decades of combined experience in top-tier technology companies.',
  };
  readonly LinkedinIcon = Linkedin;
  readonly StarIcon = Star;

  trainers = [
    {
      name: 'Karthik Rajan',
      role: 'Full Stack & Cloud Architect',
      experience: '16+ years',
      companies: 'TCS, Cognizant, Infosys',
      avatar: 'K',
      color: 'from-blue-500 to-indigo-600',
      rating: '4.9',
    },
    {
      name: 'Priya Lakshmi',
      role: 'Data Engineering Lead',
      experience: '12+ years',
      companies: 'Wipro, HCL, Accenture',
      avatar: 'P',
      color: 'from-violet-500 to-purple-600',
      rating: '4.8',
    },
  ];
}
