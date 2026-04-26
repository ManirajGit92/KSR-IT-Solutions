import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mission',
  standalone: true,
  templateUrl: './mission.component.html'
})
export class MissionComponent {
  @Input() content: any = {
    title: 'Ready to start your journey?',
    description: 'Join hundreds of successful graduates who have transformed their lives through our world-class IT training programs.',
    buttonText: 'Get Started Today',
    buttonLink: '#contact'
  };
}
