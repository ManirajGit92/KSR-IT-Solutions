import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { LucideAngularModule, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-angular';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './contact-form.component.html'
})
export class ContactFormComponent {
  @Input() content: any = {
    title: 'Get in <span class="text-gradient">Touch</span>',
    subtitle: 'Have questions? Our team is here to help you choose the right path for your career goals.'
  };
  firebaseService = inject(FirebaseService);
  
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  formData = { name: '', email: '', phone: '', message: '' };

  readonly PhoneIcon = Phone;
  readonly MailIcon = Mail;
  readonly CheckIcon = CheckCircle2;
  readonly AlertIcon = AlertCircle;

  async handleSubmit() {
    this.status = 'loading';
    try {
      await addDoc(collection(this.firebaseService.db, 'inquiries'), {
        ...this.formData,
        submittedAt: serverTimestamp()
      });
      this.status = 'success';
      this.formData = { name: '', email: '', phone: '', message: '' };
      setTimeout(() => this.status = 'idle', 5000);
    } catch (err) {
      console.error(err);
      this.status = 'error';
    }
  }
}
