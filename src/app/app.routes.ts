import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        pathMatch: 'full' 
      },
      { 
        path: 'course/:slug', 
        loadComponent: () => import('./pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent) 
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        pathMatch: 'full' 
      },
      { 
        path: 'courses', 
        loadComponent: () => import('./pages/admin/admin-courses/admin-courses.component').then(m => m.AdminCoursesComponent) 
      },
      { 
        path: 'users', 
        loadComponent: () => import('./pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) 
      },
      { 
        path: 'sections', 
        loadComponent: () => import('./pages/admin/admin-sections/admin-sections.component').then(m => m.AdminSectionsComponent) 
      },
      { 
        path: 'trainers', 
        loadComponent: () => import('./pages/admin/admin-trainers/admin-trainers.component').then(m => m.AdminTrainersComponent) 
      },
      { 
        path: 'testimonials', 
        loadComponent: () => import('./pages/admin/admin-testimonials/admin-testimonials.component').then(m => m.AdminTestimonialsComponent) 
      },
      { 
        path: 'batches', 
        loadComponent: () => import('./pages/admin/admin-batches/admin-batches.component').then(m => m.AdminBatchesComponent) 
      },
      { 
        path: 'faqs', 
        loadComponent: () => import('./pages/admin/admin-faqs/admin-faqs.component').then(m => m.AdminFaqsComponent) 
      },
      { 
        path: 'enquiries', 
        loadComponent: () => import('./pages/admin/admin-enquiries/admin-enquiries.component').then(m => m.AdminEnquiriesComponent) 
      },
      { 
        path: 'students', 
        loadComponent: () => import('./pages/admin/admin-students/admin-students.component').then(m => m.AdminStudentsComponent) 
      },
      { 
        path: 'analytics', 
        loadComponent: () => import('./pages/admin/admin-analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent) 
      }
    ]
  },
  {
    path: 'student',
    loadComponent: () => import('./layouts/student-layout/student-layout.component').then(m => m.StudentLayoutComponent),
    canActivate: [authGuard],
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
        pathMatch: 'full' 
      },
      { 
        path: 'certificates', 
        loadComponent: () => import('./pages/student/student-certificates/student-certificates.component').then(m => m.StudentCertificatesComponent) 
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
