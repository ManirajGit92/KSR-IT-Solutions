import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Course } from '../../services/firebase.service';
import { CourseCardComponent } from '../course-card/course-card.component';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

const COURSES_SEED: Omit<Course, 'id'>[] = [
  {
    title: "Mastering Snowflake",
    description: "Cloud Data Platform architecture and performance optimization.",
    duration: "6 Months",
    level: "Intermediate",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnldijmdWSGtk6QwP7zskfVPsgRZzRomoe6bdxrz-aMWBtJ7hMW6v6c3uD3Zu-uOhF0mBz0NB26HXFWWaBfMCZiOibBCJ4KUCW6wL4qmb3rndThgF0vzJbJZHSXPSx5mT38LxfLku6awBKNI9GfXs_A1BsvhBROw9imymdZwFhT7RhYLvDH1ReVnW7m5CaNJR2SA5aP9tKN0ZwdGY4tZvrRbaCdLJfy95BxCwo7kgdRSQu2R0X0WNw8GzJ3QUXicPmTDBMmZYB-mE",
    badge: "Bestseller"
  },
  {
    title: "Advanced SQL Mastery",
    description: "Master complex queries, window functions, and performance tuning.",
    duration: "4 Months",
    level: "Advanced",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8KoHwxKEgU6y3bqFcjFB4wP3bS1bAXzEavKOZQxO0VjqNFJfnIkrcI1WBmWO1UlUXTrMvFUQBr5gYfOfQnkPmW6Jf_VLvf8eTEimSwz8JfFFZAxHVgPISuyGKl3UTm8heDhxP3_L-5xbt3gkYsHl_op6p32t6T-7O0eYYCtHjBnsn0J1EBZw40tPgOy3lXZIJZ2g076hKCMLupDSqnaejHfQBqci_IfVeN2n0I167bnhisA8KJb86onuGpNHiOT2uWPotwsl7FWI",
    badge: "Hot Topic"
  }
];

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
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
    try {
      for (const c of COURSES_SEED) {
        await addDoc(collection(this.firebaseService.db, 'courses'), c);
      }
      alert("Database seeded successfully!");
    } catch (err) {
      console.error(err);
      alert("Seeding failed. Check console.");
    }
  }
}
