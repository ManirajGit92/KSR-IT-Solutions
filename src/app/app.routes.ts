import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminCoursesComponent } from './pages/admin/admin-courses/admin-courses.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminSectionsComponent } from './pages/admin/admin-sections/admin-sections.component';
import { AdminTrainersComponent } from './pages/admin/admin-trainers/admin-trainers.component';
import { AdminTestimonialsComponent } from './pages/admin/admin-testimonials/admin-testimonials.component';
import { AdminBatchesComponent } from './pages/admin/admin-batches/admin-batches.component';
import { AdminFaqsComponent } from './pages/admin/admin-faqs/admin-faqs.component';
import { AdminEnquiriesComponent } from './pages/admin/admin-enquiries/admin-enquiries.component';
import { AdminStudentsComponent } from './pages/admin/admin-students/admin-students.component';
import { StudentDashboardComponent } from './pages/student/student-dashboard/student-dashboard.component';
import { StudentCertificatesComponent } from './pages/student/student-certificates/student-certificates.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'course/:slug', component: CourseDetailComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: AdminDashboardComponent, pathMatch: 'full' },
      { path: 'courses', component: AdminCoursesComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'sections', component: AdminSectionsComponent },
      { path: 'trainers', component: AdminTrainersComponent },
      { path: 'testimonials', component: AdminTestimonialsComponent },
      { path: 'batches', component: AdminBatchesComponent },
      { path: 'faqs', component: AdminFaqsComponent },
      { path: 'enquiries', component: AdminEnquiriesComponent },
      { path: 'students', component: AdminStudentsComponent }
    ]
  },
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: StudentDashboardComponent, pathMatch: 'full' },
      { path: 'certificates', component: StudentCertificatesComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
