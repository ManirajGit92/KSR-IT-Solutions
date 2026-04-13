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
  testimonials = [
    {
      id: '1',
      name: "Rahul Sharma",
      role: "Data Engineer at TechCorp",
      content: "The training at KSR was a game changer. I transitioned from a legacy DBA role to a Snowflake Developer in just 4 months. The hands-on projects were exactly like the work I do now.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpoCxkTKNfCverTARayWRWkRuERG-iEFY6lNM4HfQZOvoXRAeDlKPxDV8rHo3HTvC886L59FedS7sD-hmh4KWbZ2p0s6yc15RC6gz3sUr_2zZuu-T5TZbUBHPngliwIQmVoZVqmicutLtTzi2_IjonWj2Wu3yxpzNJ4ofg0SztRlDANuE-1uMxmHq3byiMooTRJInQ5BKV70OcLdZ0enr5rH1LcOLUQP8CHbkKfcIa3rDt96tYV_HEvnoZqqnJ7OZrVfK8YOnnwnM",
      rating: 5
    }
  ];

  readonly StarIcon = Star;
  
  getRatingArray(n: number) {
    return new Array(n);
  }
}
