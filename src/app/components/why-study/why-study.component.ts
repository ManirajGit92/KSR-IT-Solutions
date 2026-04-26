import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Brain, Rocket, School, Clock, Award } from 'lucide-angular';

@Component({
  selector: 'app-why-study',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './why-study.component.html'
})
export class WhyStudyComponent {
  @Input() content: any = {
    title: 'Why Choose KSR IT Solutions?',
    subtitle: 'We don\'t just teach code; we build careers with industry-aligned curriculum and hands-on experience.'
  };

  benefits = [
    { icon: Brain, title: "Expert Trainers", desc: "Learn from MNC veterans with 15+ years of real industry experience in Fortune 500 companies.", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-blue-600" },
    { icon: Rocket, title: "Real-Time Projects", desc: "Build production-grade applications with live datasets, APIs, and industry-standard architecture.", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500 to-emerald-600" },
    { icon: School, title: "Placement Support", desc: "Resume workshops, mock interviews, and direct referrals to 50+ hiring partners in top companies.", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400", gradient: "from-violet-500 to-violet-600" },
    { icon: Clock, title: "Flexible Timings", desc: "Weekend & weekday batches for working professionals. Attend live or watch recorded sessions anytime.", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", gradient: "from-amber-500 to-amber-600" },
    { icon: Award, title: "Certifications", desc: "Industry-recognized certifications on course completion, verified and shareable on LinkedIn.", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400", gradient: "from-rose-500 to-rose-600" },
  ];
}
