import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FirebaseService, Course } from '../../services/firebase.service';
import {
  LucideAngularModule,
  Calendar,
  BarChart,
  Star,
  IndianRupee,
  Clock,
  CheckCircle2,
  ChevronRight,
  Download,
  Award,
  Users,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  PlayCircle,
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CourseDetailDefaults } from '../../Defaults/common.default';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, FormsModule],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);

  course: any = null;
  relatedCourses: Course[] = [];
  loading = true;
  activeModuleIndex = 0;
  activeFaqIndex = 0;
  courseDefaults = CourseDetailDefaults;
  // Icons
  readonly CalendarIcon = Calendar;
  readonly BarChartIcon = BarChart;
  readonly StarIcon = Star;
  readonly RupeeIcon = IndianRupee;
  readonly ClockIcon = Clock;
  readonly CheckCircleIcon = CheckCircle2;
  readonly ChevronRightIcon = ChevronRight;
  readonly DownloadIcon = Download;
  readonly AwardIcon = Award;
  readonly UsersIcon = Users;
  readonly ArrowRightIcon = ArrowRight;
  readonly MessageIcon = MessageSquare;
  readonly HelpIcon = HelpCircle;
  readonly PlayIcon = PlayCircle;

  readonly defaultSyllabus = this.courseDefaults.defaultSyllabus;

  readonly defaultProjects = this.courseDefaults.defaultProjects;

  readonly defaultPlans = this.courseDefaults.defaultPlans;

  readonly defaultBatches = this.courseDefaults.defaultBatches;

  readonly defaultReviews = this.courseDefaults.defaultReviews;

  readonly defaultFaq = this.courseDefaults.defaultFaq;

  // Demo Form
  demoForm = {
    name: '',
    email: '',
    phone: '',
    course: '',
  };
  formStatus: 'idle' | 'loading' | 'success' = 'idle';

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      const slug = params['slug'];
      if (slug) {
        this.loading = true;
        try {
          this.course = await this.firebaseService.getCourseBySlug(slug);
          if (this.course) {
            this.course = {
              ...this.course,
              batches: this.parseBatches(this.course.batches),
              faq: this.parseBatches(this.course.faq),
              feesPlans: this.parseBatches(this.course.feesPlans),
              keyPoints: this.parseBatches(this.course.keyPoints),
              projects: this.parseBatches(this.course.projects),
              reviews: this.parseBatches(this.course.reviews),
              syllabus: this.parseBatches(this.course.syllabus),
            };
          }
        } catch (err) {
          console.warn('Firestore fetch failed, using demo fallback:', err);
        }

        // Fetch related courses
        try {
          const all = await this.firebaseService.getCourses();
          this.relatedCourses = all.filter((c) => c.slug !== slug).slice(0, 3);
        } catch (err) {
          console.warn('Related courses fetch failed');
        }

        this.loading = false;
        if (this.course) {
          this.demoForm.course = this.course.title;
        }
      }
    });
  }
  parseBatches(data: any): any[] {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return Array.isArray(data) ? data : [];
  }
  get batchesList(): any[] {
    if (!this.course) return this.defaultBatches;

    const batches = this.course.batches;

    if (typeof batches === 'string') {
      try {
        return JSON.parse(batches);
      } catch {
        return this.defaultBatches;
      }
    }

    return Array.isArray(batches) ? batches : this.defaultBatches;
  }
  toggleModule(index: number) {
    this.activeModuleIndex = this.activeModuleIndex === index ? -1 : index;
  }

  toggleFaq(index: number) {
    this.activeFaqIndex = this.activeFaqIndex === index ? -1 : index;
  }

  async handleDemoSubmit() {
    this.formStatus = 'loading';
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    this.formStatus = 'success';
    setTimeout(() => {
      this.formStatus = 'idle';
      this.demoForm = {
        name: '',
        email: '',
        phone: '',
        course: this.course?.title || '',
      };
    }, 3000);
  }
}
