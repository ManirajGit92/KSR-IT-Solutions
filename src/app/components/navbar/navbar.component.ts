import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { LucideAngularModule, Menu, X, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  firebaseService = inject(FirebaseService);
  isOpen = false;
  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly LogOutIcon = LogOut;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
