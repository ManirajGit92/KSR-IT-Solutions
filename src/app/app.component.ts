import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Brain } from 'lucide-angular';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { CompetenciesComponent } from './components/competencies/competencies.component';
import { CoursesComponent } from './components/courses/courses.component';
import { WhyStudyComponent } from './components/why-study/why-study.component';
import { MissionComponent } from './components/mission/mission.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    NavbarComponent,
    HeroComponent,
    CompetenciesComponent,
    CoursesComponent,
    WhyStudyComponent,
    MissionComponent,
    TestimonialsComponent,
    ContactFormComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  readonly BrainIcon = Brain;
}
