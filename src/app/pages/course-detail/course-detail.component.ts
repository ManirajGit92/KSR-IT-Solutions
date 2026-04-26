import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FirebaseService, Course } from '../../services/firebase.service';
import { LucideAngularModule, 
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
  PlayCircle
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, FormsModule],
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firebaseService = inject(FirebaseService);

  course: Course | null = null;
  relatedCourses: Course[] = [];
  loading = true;
  activeModuleIndex = 0;
  activeFaqIndex = 0;

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

  readonly defaultSyllabus = [
    { title: 'Fundamentals & Setup', topics: ['Environment configuration', 'Core syntax & concepts', 'Basic project structure'] },
    { title: 'Intermediate Concepts', topics: ['Data handling & state', 'Component architecture', 'API integration'] },
    { title: 'Advanced Patterns', topics: ['Performance optimization', 'Security best practices', 'Scaling applications'] }
  ];

  readonly defaultProjects = [
    { title: 'E-commerce Platform', description: 'Build a fully functional shopping cart with payment integration.', image: '' },
    { title: 'Social Media Dashboard', description: 'Real-time feed, profiles, and interactive analytics.', image: '' }
  ];

  readonly defaultPlans = [
    { name: 'Standard', price: '₹14,999', features: ['All recorded sessions', 'Source code access', 'Certificate'] },
    { name: 'Premium', price: '₹19,999', features: ['Live 1-on-1 sessions', 'Direct mentor referrals', 'Job assurance'], highlight: true }
  ];

  readonly defaultBatches = [
    { timing: 'Evening Batch', days: 'Mon - Fri', startDate: 'May 10', status: 'Filling Fast' },
    { timing: 'Weekend Batch', days: 'Sat - Sun', startDate: 'May 15', status: 'Few Seats Left' }
  ];

  readonly defaultReviews = [
    { studentName: 'Rahul Sharma', rating: 5, comment: 'Amazing course! The projects really helped me understand the concepts.', date: 'April 2026' },
    { studentName: 'Sneha Reddy', rating: 5, comment: 'The mentors are very supportive. Landed a job in 2 months.', date: 'March 2026' },
    { studentName: 'Anil Kumar', rating: 5, comment: 'Worth every penny. The curriculum is very industry-focused.', date: 'Feb 2026' }
  ];

  readonly defaultFaq = [
    { q: 'Is there a prerequisite for this course?', a: 'Basic understanding of programming is recommended but not mandatory for beginners.' },
    { q: 'Will I get placement support?', a: 'Yes, we provide resume building, mock interviews, and referrals to hiring partners.' }
  ];

  // Demo Form
  demoForm = {
    name: '',
    email: '',
    phone: '',
    course: ''
  };
  formStatus: 'idle' | 'loading' | 'success' = 'idle';

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      const slug = params['slug'];
      if (slug) {
        this.loading = true;
        try {
          this.course = await this.firebaseService.getCourseBySlug(slug);
        } catch (err) {
          console.warn('Firestore fetch failed, using demo fallback:', err);
        }
        
        // Demo Fallback for requested courses
        if (!this.course) {
          if (slug === 'angular') {
            this.course = {
              id: 'demo-angular',
              slug: 'angular',
              title: 'Modern Angular Pro',
              description: 'Master Angular 17+ with standalone components, signals, and advanced SSR techniques.',
              duration: '6 Months',
              level: 'Intermediate',
              imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9ed9461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
              badge: 'Bestseller',
              price: '₹14,999',
              rating: '4.9'
            } as Course;
          } else if (slug === 'python') {
            this.course = {
              id: 'demo-python',
              slug: 'python',
              title: 'Python Data Science',
              description: 'Master Python, Pandas, and Machine Learning from scratch.',
              duration: '4 Months',
              level: 'Beginner',
              imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
              badge: 'New',
              price: '₹12,999',
              rating: '4.8'
            } as Course;
          } else if (slug === 'java') {
            this.course = {
              id: 'demo-java',
              slug: 'java',
              title: 'Java Full Stack',
              description: 'End-to-end enterprise Java development with Spring Boot.',
              duration: '8 Months',
              level: 'Advanced',
              imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
              badge: 'Job Guarantee',
              price: '₹19,999',
              rating: '4.9'
            } as Course;
          }
        }

        // Fetch related courses
        try {
          const all = await this.firebaseService.getCourses();
          this.relatedCourses = all.filter(c => c.slug !== slug).slice(0, 3);
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

  toggleModule(index: number) {
    this.activeModuleIndex = this.activeModuleIndex === index ? -1 : index;
  }

  toggleFaq(index: number) {
    this.activeFaqIndex = this.activeFaqIndex === index ? -1 : index;
  }

  async handleDemoSubmit() {
    this.formStatus = 'loading';
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    this.formStatus = 'success';
    setTimeout(() => {
      this.formStatus = 'idle';
      this.demoForm = { name: '', email: '', phone: '', course: this.course?.title || '' };
    }, 3000);
  }
}
