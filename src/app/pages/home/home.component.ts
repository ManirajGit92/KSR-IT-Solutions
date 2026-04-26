import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { CompetenciesComponent } from '../../components/competencies/competencies.component';
import { CoursesComponent } from '../../components/courses/courses.component';
import { WhyStudyComponent } from '../../components/why-study/why-study.component';
import { MissionComponent } from '../../components/mission/mission.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { TrainersComponent } from '../../components/trainers/trainers.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { BatchesComponent } from '../../components/batches/batches.component';
import { FaqComponent } from '../../components/faq/faq.component';
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
    TrainersComponent,
    TimelineComponent,
    BatchesComponent,
    FaqComponent,
    LucideAngularModule
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  readonly BrainIcon = Brain;
}
