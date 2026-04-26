import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ClipboardCheck, BookOpen, Code2, Rocket, Trophy } from 'lucide-angular';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './timeline.component.html'
})
export class TimelineComponent {
  @Input() content: any = {
    title: 'Your Path to <span class="text-gradient">Success</span>',
    subtitle: 'A proven step-by-step roadmap to transform you from a beginner to a high-earning tech professional.'
  };
  steps = [
    { icon: ClipboardCheck, title: 'Enroll & Assess', desc: 'Pick your track, complete a skills assessment, and get a personalized learning roadmap.', color: 'from-blue-500 to-blue-600' },
    { icon: BookOpen, title: 'Learn & Practice', desc: 'Attend live classes, access recordings, and practice with hands-on lab exercises.', color: 'from-violet-500 to-violet-600' },
    { icon: Code2, title: 'Build Projects', desc: 'Work on real-world projects with mentor guidance and code reviews every week.', color: 'from-emerald-500 to-emerald-600' },
    { icon: Rocket, title: 'Interview Prep', desc: 'Resume building, mock interviews, and company-specific preparation for your dream job.', color: 'from-amber-500 to-amber-600' },
    { icon: Trophy, title: 'Get Placed', desc: 'Get certified and receive dedicated placement support until you land your job.', color: 'from-rose-500 to-rose-600' },
  ];
}
