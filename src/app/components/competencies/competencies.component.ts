import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Cloud, Terminal, Database, Code, HardDrive, Layout } from 'lucide-angular';

@Component({
  selector: 'app-competencies',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './competencies.component.html'
})
export class CompetenciesComponent {
  items = [
    { icon: Cloud, title: "Snowflake", desc: "Cloud Data Platform architecture and performance." },
    { icon: Terminal, title: "DBT", desc: "Modern data transformation and modeling." },
    { icon: Database, title: "Oracle SQL", desc: "Enterprise relational database mastery." },
    { icon: Code, title: "PL/SQL", desc: "Procedural language extensions for SQL." },
    { icon: HardDrive, title: "MS SQL", desc: "Microsoft SQL Server administration." },
    { icon: Layout, title: "Modeling", desc: "Conceptual, logical and physical design." },
  ];
}
