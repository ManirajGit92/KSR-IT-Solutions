import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Course } from '../../services/firebase.service';
import { CourseCardComponent } from '../course-card/course-card.component';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { CourseDefaults } from '../../Defaults/common.default';

const COURSES_SEED: Omit<Course, 'id'>[] = CourseDefaults.DefCourses;

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  @Input() content: any = {
    title: 'Explore Our <span class="text-gradient">Programs</span>',
    subtitle:
      'From beginner to expert, we offer specialized training paths designed to make you industry-ready.',
  };
  firebaseService = inject(FirebaseService);
  courses: Course[] = [];
  loading = true;

  ngOnInit() {
    const q = query(
      collection(this.firebaseService.db, 'courses'),
      orderBy('title'),
    );

    onSnapshot(
      q,
      (snapshot) => {
        this.courses = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Course,
        );
        console.log('this.courses====>', this.courses);
        this.loading = false;
      },
      (err) => {
        console.error('Firestore Error:', err);
        this.loading = false;
      },
    );
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
        status: 'pending',
      });
      alert(
        `Successfully enrolled in ${course.title}! Our team will contact you soon.`,
      );
    } catch (err) {
      console.error(err);
      alert('Enrollment failed. Please try again.');
    }
  }

  async seedData() {
    const { doc, setDoc } = await import('firebase/firestore');
    try {
      for (const c of COURSES_SEED) {
        const courseRef = doc(this.firebaseService.db, 'courses', c.slug);
        await setDoc(courseRef, c, { merge: true });
      }
      alert('Database synced successfully with slugs!');
    } catch (err) {
      console.error(err);
      alert('Sync failed. Check console.');
    }
  }
}
