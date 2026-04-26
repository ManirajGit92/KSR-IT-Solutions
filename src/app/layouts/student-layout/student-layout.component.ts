import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { ThemeService } from '../../services/theme.service';
import { LucideAngularModule, MonitorPlay, Award, LogOut, Sun, Moon, Home } from 'lucide-angular';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './student-layout.component.html'
})
export class StudentLayoutComponent {
  firebaseService = inject(FirebaseService);
  themeService = inject(ThemeService);

  readonly MonitorPlayIcon = MonitorPlay;
  readonly AwardIcon = Award;
  readonly LogOutIcon = LogOut;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly HomeIcon = Home;
}
