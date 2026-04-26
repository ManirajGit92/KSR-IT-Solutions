import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Star } from 'lucide-angular';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './testimonials.component.html'
})
export class TestimonialsComponent {
  stats = [
    { value: '500+', label: 'Students Placed' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '50+', label: 'Hiring Partners' },
    { value: '4.9/5', label: 'Average Rating' },
  ];

  testimonials = [
    {
      id: '1',
      name: "Rahul Sharma",
      role: "Data Engineer at TechCorp",
      content: "The training at KSR was a game changer. I transitioned from a legacy DBA role to a Snowflake Developer in just 4 months. The hands-on projects were exactly like the work I do now.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpoCxkTKNfCverTARayWRWkRuERG-iEFY6lNM4HfQZOvoXRAeDlKPxDV8rHo3HTvC886L59FedS7sD-hmh4KWbZ2p0s6yc15RC6gz3sUr_2zZuu-T5TZbUBHPngliwIQmVoZVqmicutLtTzi2_IjonWj2Wu3yxpzNJ4ofg0SztRlDANuE-1uMxmHq3byiMooTRJInQ5BKV70OcLdZ0enr5rH1LcOLUQP8CHbkKfcIa3rDt96tYV_HEvnoZqqnJ7OZrVfK8YOnnwnM",
      rating: 5
    },
    {
      id: '2',
      name: "Priya Meena",
      role: "Cloud Engineer at Infosys",
      content: "KSR's structured approach and mentorship helped me crack interviews at top MNCs. The real-time project experience gave me the confidence I needed to perform on day one.",
      imageUrl: "https://ui-avatars.com/api/?name=Priya+Meena&background=465f88&color=fff&size=200&bold=true",
      rating: 5
    },
    {
      id: '3',
      name: "Vikram Reddy",
      role: "SQL Developer at Wipro",
      content: "Coming from a non-IT background, I was skeptical. But the trainers at KSR made complex SQL concepts incredibly easy to grasp. Their placement support was outstanding.",
      imageUrl: "https://ui-avatars.com/api/?name=Vikram+Reddy&background=904d00&color=fff&size=200&bold=true",
      rating: 5
    }
  ];

  readonly StarIcon = Star;
  
  getRatingArray(n: number) {
    return new Array(n);
  }
}
