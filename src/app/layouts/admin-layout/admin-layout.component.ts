import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { ThemeService } from '../../services/theme.service';
import { LucideAngularModule, LayoutDashboard, Book, Users, Layers, LogOut, Sun, Moon, GraduationCap, Star, Calendar, HelpCircle, MessageSquare } from 'lucide-angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  firebaseService = inject(FirebaseService);
  themeService = inject(ThemeService);

  readonly LayoutDashboardIcon = LayoutDashboard;
  readonly BookIcon = Book;
  readonly UsersIcon = Users;
  readonly LayersIcon = Layers;
  readonly LogOutIcon = LogOut;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly GraduationCapIcon = GraduationCap;
  readonly StarIcon = Star;
  readonly CalendarIcon = Calendar;
  readonly HelpCircleIcon = HelpCircle;
  readonly MessageSquareIcon = MessageSquare;
}
