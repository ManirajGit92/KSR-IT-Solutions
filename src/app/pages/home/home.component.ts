import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FirebaseService,
  HomepageSection,
} from '../../services/firebase.service';
import { LucideAngularModule, Layout } from 'lucide-angular';

// Section Components
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
import { HomeDefaults } from '../../Defaults/common.default';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
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
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  sections: HomepageSection[] = [];
  loading = true;
  readonly LayoutIcon = Layout;
  homeDefaults = HomeDefaults;

  async ngOnInit() {
    await this.loadSections();
  }

  async loadSections() {
    this.loading = true;
    try {
      this.sections =
        await this.firebaseService.getCollection<HomepageSection>(
          'homepage_sections',
        );
      this.sections = this.sections
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order);
      console.log('Loaded homepage sections:', this.sections);
    } catch (err) {
      console.error('Failed to load homepage sections:', err);
    } finally {
      this.loading = false;
    }
  }

  async seedDefaultSections() {
    const defaults: any[] = this.homeDefaults.DefHomePageData;
    if (
      confirm('This will seed the initial content for your website. Proceed?')
    ) {
      this.loading = true;
      try {
        for (const section of defaults) {
          await this.firebaseService.addDocument('homepage_sections', section);
        }
        await this.loadSections();
      } catch (err) {
        alert('Seeding failed. Please check permissions.');
      }
    }
  }
}
