import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Course } from '../../services/firebase.service';
import { CourseCardComponent } from '../course-card/course-card.component';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

const COURSES_SEED: Omit<Course, 'id'>[] = [
  {
    slug: "angular",
    title: "Modern Angular Pro",
    description: "Master Angular 17+ with standalone components, signals, and advanced SSR techniques.",
    duration: "6 Months",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1593720213428-28a5b9ed9461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    badge: "Most Popular",
    price: "₹14,999",
    originalPrice: "₹24,999",
    rating: "4.9",
    longDescription: "This course covers everything from basic component architecture to advanced state management with Signals and RxJS. You will build a production-ready enterprise application.",
    syllabus: [
      { title: 'Angular Core', topics: ['Standalone Components', 'Signals API', 'Control Flow Syntax'] },
      { title: 'Routing & State', topics: ['Advanced Router Guards', 'RxJS Patterns', 'NGXS/NgRx Store'] }
    ]
  },
  {
    slug: "python",
    title: "Python for Data Science",
    description: "Learn Python from scratch and dive into Pandas, NumPy, and Machine Learning basics.",
    duration: "4 Months",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    badge: "Bestseller",
    price: "₹12,999",
    originalPrice: "₹19,999",
    rating: "4.8",
    longDescription: "Master the most versatile programming language. From automation scripts to complex data analysis, this course prepares you for the high-demand data science roles."
  },
  {
    slug: "java",
    title: "Java Full Stack Masterclass",
    description: "End-to-end Java development with Spring Boot, Microservices, and Cloud Deployment.",
    duration: "8 Months",
    level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    badge: "Hot Topic",
    price: "₹19,999",
    originalPrice: "₹29,999",
    rating: "4.9",
    longDescription: "The ultimate guide to building enterprise-grade Java applications. Covers Spring Security, Docker, Kubernetes, and Cloud-native development."
  }
];

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
  @Input() content: any = {
    title: 'Explore Our <span class="text-gradient">Programs</span>',
    subtitle: 'From beginner to expert, we offer specialized training paths designed to make you industry-ready.'
  };
  firebaseService = inject(FirebaseService);
  courses: Course[] = [];
  loading = true;

  ngOnInit() {
    const q = query(collection(this.firebaseService.db, 'courses'), orderBy('title'));
    onSnapshot(q, (snapshot) => {
      this.courses = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Course));
      this.loading = false;
    }, (err) => {
      console.error("Firestore Error:", err);
      this.loading = false;
    });
  }

  async handleEnroll(course: Course) {
    const user = this.firebaseService.user;
    if (!user) {
      this.firebaseService.signInWithGoogle();
      return;
    }
    try {
      await addDoc(collection(this.firebaseService.db, 'enrollments'), {
        userId: user.uid,
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: serverTimestamp(),
        status: 'pending'
      });
      alert(`Successfully enrolled in ${course.title}! Our team will contact you soon.`);
    } catch (err) {
      console.error(err);
      alert("Enrollment failed. Please try again.");
    }
  }

  async seedData() {
    const { doc, setDoc } = await import('firebase/firestore');
    try {
      for (const c of COURSES_SEED) {
        const courseRef = doc(this.firebaseService.db, 'courses', c.slug);
        await setDoc(courseRef, c, { merge: true });
      }
      alert("Database synced successfully with slugs!");
    } catch (err) {
      console.error(err);
      alert("Sync failed. Check console.");
    }
  }
}
