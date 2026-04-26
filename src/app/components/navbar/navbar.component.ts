import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { ThemeService } from '../../services/theme.service';
import { LucideAngularModule, Menu, X, LogOut, Sun, Moon, Shield, LayoutDashboard, Book, Users, Calendar } from 'lucide-angular';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  firebaseService = inject(FirebaseService);
  themeService = inject(ThemeService);
  isOpen = false;
  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly LogOutIcon = LogOut;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly ShieldIcon = Shield;
  readonly LayoutDashboardIcon = LayoutDashboard;
  readonly BookIcon = Book;
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
