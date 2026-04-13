import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { CompetenciesComponent } from '../../components/competencies/competencies.component';
import { CoursesComponent } from '../../components/courses/courses.component';
import { WhyStudyComponent } from '../../components/why-study/why-study.component';
import { MissionComponent } from '../../components/mission/mission.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { LucideAngularModule, Brain } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CompetenciesComponent,
    CoursesComponent,
    WhyStudyComponent,
    MissionComponent,
    TestimonialsComponent,
    ContactFormComponent,
    LucideAngularModule
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  readonly BrainIcon = Brain;
}
