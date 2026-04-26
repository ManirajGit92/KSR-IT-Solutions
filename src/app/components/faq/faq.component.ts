import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './faq.component.html'
})
export class FaqComponent {
  @Input() content: any = {
    title: 'Frequently Asked <span class="text-gradient">Questions</span>',
    subtitle: 'Everything you need to know about our training programs, placement support, and certification process.'
  };
  readonly ChevronDownIcon = ChevronDown;

  faqs = [
    { q: 'Who can join KSR IT Solutions?', a: 'Students, fresh graduates, and working professionals looking to start or advance their IT career. No prior coding experience is required for beginner-level programs.', open: false },
    { q: 'What is the class format — online or offline?', a: 'We offer both live online classes and hybrid batches. All sessions are recorded and available for replay. Weekend batches are available for working professionals.', open: false },
    { q: 'Do you provide placement assistance?', a: 'Yes! We provide 100% placement support including resume building, mock interviews, soft skills training, and direct referrals to 50+ hiring partners.', open: false },
    { q: 'What certifications do I receive?', a: 'You receive an industry-recognized certification upon course completion. Certifications are verifiable online and shareable on LinkedIn.', open: false },
    { q: 'Can I pay in installments?', a: 'Yes, we offer flexible EMI options and installment plans. We also have special discounts for students and group enrollments. Contact us for details.', open: false },
    { q: 'What if I miss a class?', a: 'All classes are recorded. You can watch the recordings anytime. Additionally, our trainers offer doubt-clearing sessions every week.', open: false },
  ];

  toggle(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
