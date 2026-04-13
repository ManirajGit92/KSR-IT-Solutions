import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Brain, Rocket, School } from 'lucide-angular';

@Component({
  selector: 'app-why-study',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './why-study.component.html'
})
export class WhyStudyComponent {
  benefits = [
    { icon: Brain, title: "Industry Experts", desc: "Learn from veterans with over 15+ years of experience in Fortune 500 tech companies.", color: "bg-secondary/10 text-secondary" },
    { icon: Rocket, title: "Real-time Projects", desc: "Don't just watch; build. Work on live datasets and industry-standard scenarios.", color: "bg-tertiary-container/10 text-on-tertiary-container" },
    { icon: School, title: "Placement Assistance", desc: "Resume workshops, mock interviews, and direct referrals to hiring partners.", color: "bg-primary-container/10 text-primary-container" },
  ];
}
