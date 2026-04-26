import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, HomepageSection } from '../../services/firebase.service';
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
    FaqComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  sections: HomepageSection[] = [];
  loading = true;
  readonly LayoutIcon = Layout;

  async ngOnInit() {
    await this.loadSections();
  }

  async loadSections() {
    this.loading = true;
    try {
      this.sections = await this.firebaseService.getCollection<HomepageSection>('homepage_sections');
      this.sections = this.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);
    } catch (err) {
      console.error('Failed to load homepage sections:', err);
    } finally {
      this.loading = false;
    }
  }

  async seedDefaultSections() {
    const defaults = [
      { name: 'Hero Banner', type: 'hero', order: 1, visible: true, anchor: 'home', content: { title: 'Transform Your Career with KSR IT', subtitle: 'Industry-driven training in Full Stack, Cloud, Data Engineering & more.', buttonText: '🚀 Join Now', buttonLink: '#contact' } },
      { name: 'Why Us', type: 'about', order: 2, visible: true, anchor: 'about', content: { title: 'Why Choose KSR IT?', subtitle: 'We build careers with industry-aligned curriculum.' } },
      { name: 'Programs', type: 'courses', order: 3, visible: true, anchor: 'courses', content: { title: 'Our Specializations', subtitle: 'Master the tech of tomorrow.' } },
      { name: 'Trainers', type: 'trainers', order: 4, visible: true, anchor: 'trainers', content: { title: 'Learn from Experts', subtitle: 'MNC professionals at your service.' } },
      { name: 'Upcoming Batches', type: 'batches', order: 5, visible: true, anchor: 'batches', content: { title: 'Upcoming <span class="text-gradient">Batches</span>', subtitle: 'Join our professional training programs.' } },
      { name: 'Success Stories', type: 'testimonials', order: 6, visible: true, anchor: 'testimonials', content: { title: 'Student Success', subtitle: 'Join our list of high-earning graduates.' } },
      { name: 'Frequently Asked Questions', type: 'faq', order: 7, visible: true, anchor: 'faq', content: { title: 'Have <span class="text-gradient">Questions?</span>', subtitle: 'Find answers to common queries about our training.' } },
      { name: 'Contact Us', type: 'contact', order: 8, visible: true, anchor: 'contact', content: { title: 'Get in Touch', subtitle: 'Start your journey today.' } }
    ];

    if (confirm('This will seed the initial content for your website. Proceed?')) {
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
