import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  LucideAngularModule,
  Plus,
  MoreVertical,
  Users,
  GraduationCap,
  X,
  Upload,
  Save,
  Trash2,
  Download,
} from 'lucide-angular';
import { FirebaseService, Course } from '../../../services/firebase.service';
import { StorageService } from '../../../services/storage.service';
import { ExportService } from '../../../services/export.service';
import {
  AdminCourseDefaults,
  CourseDetailDefaults,
} from '../../../Defaults/common.default';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-courses.component.html',
})
export class AdminCoursesComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private fb = inject(FormBuilder);
  private exportService = inject(ExportService);

  readonly PlusIcon = Plus;
  readonly MoreVerticalIcon = MoreVertical;
  readonly UsersIcon = Users;
  readonly GraduationCapIcon = GraduationCap;
  readonly XIcon = X;
  readonly UploadIcon = Upload;
  readonly SaveIcon = Save;
  readonly TrashIcon = Trash2;
  readonly DownloadIcon = Download;
  adminCourseDefaults = AdminCourseDefaults;
  courseDetailDefaults = CourseDetailDefaults;

  courses: Course[] = [];
  loading = true;
  showModal = false;
  editingCourse: Course | null = null;
  courseForm: FormGroup;
  // store errors for each control
  jsonErrors: any = {};

  // reusable control list
  jsonFields = [
    'syllabus',
    'batches',
    'faq',
    'feesPlans',
    'projects',
    'reviews',
    'syllabus',
    'keyPoints',
  ];

  constructor() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      description: [''],
      duration: [''],
      level: ['Beginner'],
      imageUrl: [''],
      price: [''],
      badge: [''],
      batches: [''],
      faq: [''],
      feesPlans: [''],
      keyPoints: [''],
      projects: [''],
      reviews: [''],
      syllabus: [''],
      enrolledCount: [''],
      hours: [''],
      downloadURL: ['https://i.postimg.cc/bdX5MXkd/KSR-IT.png'],
    });
  }

  async ngOnInit() {
    await this.loadCourses();
    this.setupJsonValidation();
  }

  setupJsonValidation() {
    this.jsonFields.forEach((field) => {
      this.courseForm
        .get(field)
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (!value) {
            this.jsonErrors[field] = '';
            return;
          }
          try {
            // if (field === 'keyPoints') {
            //   const array = value
            //     .split(',')
            //     .map((item: string) => item.trim())
            //     .filter((item: string) => item.length > 0);
            //   const formatted = JSON.stringify(array, null, 2);
            //   this.courseForm.get(field)?.setValue(formatted, {
            //     emitEvent: false,
            //   });
            //   this.jsonErrors[field] = '';
            // } else {
            const fixed = value
              .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":') // add quotes to keys
              .replace(/'/g, '"') // single → double quotes
              .replace(/,\s*}/g, '}') // remove trailing commas
              .replace(/,\s*]/g, ']');
            const parsed = JSON.parse(fixed);
            // Beautify JSON
            const formatted = JSON.stringify(parsed, null, 2);
            // Avoid infinite loop
            this.courseForm.get(field)?.setValue(formatted, {
              emitEvent: false,
            });
            this.jsonErrors[field] = '';
            // }
          } catch (error) {
            this.jsonErrors[field] = 'Invalid JSON format ❌';
          }
        });
    });
  }

  async loadCourses() {
    this.loading = true;
    this.courses = await this.firebaseService.getCourses();
    this.loading = false;
  }

  openModal(course?: Course) {
    console.log('course***>', course);

    if (course) {
      this.editingCourse = course;

      const formattedCourse = {
        ...course,
        batches: this.formatJsonField(course.batches),
        keyPoints: this.formatJsonField(course.keyPoints),
        // add other JSON fields if needed
      };

      this.courseForm.patchValue(formattedCourse);
    } else {
      this.editingCourse = null;
      this.courseForm.reset({ level: 'Beginner' });
    }

    this.showModal = true;
  }

  formatJsonField(data: any): string {
    if (!data) return '';

    try {
      let parsed = data;

      // Step 1: If string → parse once
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }

      // Step 2: If still string → parse again (double encoded case)
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }

      // Final: format nicely
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      console.warn('JSON format failed:', error);
      return data;
    }
  }

  closeModal() {
    this.showModal = false;
  }
  async saveCourse() {
    if (this.courseForm.invalid) return;

    let data = this.courseForm.value;
    console.log('Saving course with data:', data);
    data.batches = JSON.stringify(data.batches);
    if (this.editingCourse) {
      await this.firebaseService.updateDocument(
        'courses',
        this.editingCourse.id,
        data,
      );
    } else {
      await this.firebaseService.addDocument('courses', data);
    }

    this.closeModal();
    await this.loadCourses();
  }

  async deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      await this.firebaseService.deleteDocument('courses', id);
      await this.loadCourses();
    }
  }

  async exportCourses() {
    this.exportService.exportToCsv('courses.csv', this.courses);
  }
}
