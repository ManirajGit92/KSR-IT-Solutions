import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService, Enquiry } from '../../../services/firebase.service';
import { ExportService } from '../../../services/export.service';
import { LucideAngularModule, Search, Filter, Download, MessageSquare, Phone, Calendar, UserPlus, Clock, MoreHorizontal, CheckCircle2, AlertCircle, X } from 'lucide-angular';

@Component({
  selector: 'app-admin-enquiries',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Relationship Management</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Enquiries & Leads</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage student enquiries, demo requests, and call-backs.</p>
        </div>
        <div class="flex gap-3">
          <button (click)="exportData()" class="flex items-center gap-2 glass px-6 py-3 rounded-xl font-bold text-sm hover:border-primary/40 transition-all border border-outline-variant/10">
            <lucide-icon [img]="DownloadIcon" class="w-4 h-4"></lucide-icon> Export Excel
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="glass p-6 rounded-[32px] border border-outline-variant/10 flex flex-col lg:flex-row gap-4 items-center">
        <div class="relative flex-1 w-full">
          <lucide-icon [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40"></lucide-icon>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search by name, email or course..." 
                 class="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all">
        </div>
        <div class="flex items-center gap-3 w-full lg:w-auto">
          <select [(ngModel)]="statusFilter" class="flex-1 lg:w-40 bg-surface-container-low border border-outline-variant/10 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Closed">Closed</option>
          </select>
          <select [(ngModel)]="typeFilter" class="flex-1 lg:w-40 bg-surface-container-low border border-outline-variant/10 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all">
            <option value="All">All Types</option>
            <option value="Course">Course Enquiries</option>
            <option value="Demo">Demo Requests</option>
            <option value="Call">Call Requests</option>
            <option value="Contact">Contact Form</option>
          </select>
        </div>
      </div>

      <!-- Enquiries List -->
      <div class="space-y-4">
        <div *ngIf="loading" class="space-y-4">
           <div *ngFor="let i of [1,2,3,4,5]" class="glass h-24 rounded-2xl animate-pulse bg-surface-container-low"></div>
        </div>

        <ng-container *ngIf="!loading">
          <article *ngFor="let enquiry of filteredEnquiries" 
                   (click)="selectedEnquiry = enquiry"
                   class="glass p-5 rounded-[28px] border border-outline-variant/10 flex flex-col md:flex-row items-center gap-6 hover:border-primary/30 transition-all cursor-pointer group">
            
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container text-primary shadow-sm group-hover:scale-110 transition-transform">
              <lucide-icon [img]="getIcon(enquiry.type)" class="w-6 h-6"></lucide-icon>
            </div>

            <div class="flex-1 min-w-0 text-center md:text-left">
              <div class="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                <h3 class="font-bold text-on-surface truncate">{{ enquiry.name }}</h3>
                <span [class]="'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ' + getStatusClass(enquiry.status)">
                  {{ enquiry.status }}
                </span>
              </div>
              <div class="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1">
                 <p class="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <lucide-icon [img]="ClockIcon" class="w-3 h-3"></lucide-icon> {{ enquiry.date | date:'mediumDate' }}
                 </p>
                 <p class="text-xs text-on-surface-variant flex items-center gap-1.5 font-bold">
                    <span class="w-1 h-1 rounded-full bg-on-surface-variant/20"></span> {{ enquiry.course || 'General Enquiry' }}
                 </p>
                 <p class="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <lucide-icon [img]="UserPlusIcon" class="w-3 h-3"></lucide-icon> Assigned: {{ enquiry.assignedTo || 'Unassigned' }}
                 </p>
              </div>
            </div>

            <div class="flex items-center gap-2 pr-2">
               <button class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                  <lucide-icon [img]="PhoneIcon" class="w-4 h-4"></lucide-icon>
               </button>
               <button class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary/10 hover:text-secondary transition-all">
                  <lucide-icon [img]="MessageSquareIcon" class="w-4 h-4"></lucide-icon>
               </button>
               <button class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container-high transition-all">
                  <lucide-icon [img]="MoreIcon" class="w-4 h-4"></lucide-icon>
               </button>
            </div>
          </article>
        </ng-container>

        <div *ngIf="!loading && !filteredEnquiries.length" class="glass border-dashed p-16 rounded-[40px] text-center">
           <lucide-icon [img]="SearchIcon" class="w-12 h-12 mx-auto mb-4 text-on-surface-variant/20"></lucide-icon>
           <p class="text-sm font-bold text-on-surface-variant opacity-60">No enquiries found matching your filters.</p>
        </div>
      </div>

      <!-- Enquiry Detail Modal -->
      <div *ngIf="selectedEnquiry" class="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8">
        <div class="absolute inset-0 bg-surface/80 backdrop-blur-md" (click)="selectedEnquiry = null"></div>
        <div class="relative w-full max-w-4xl glass rounded-[40px] border border-outline-variant/20 shadow-2xl overflow-hidden animate-scale-in">
          <div class="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container/30">
            <div class="flex items-center gap-4">
               <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-lg">
                  <lucide-icon [img]="getIcon(selectedEnquiry.type)" class="w-7 h-7"></lucide-icon>
               </div>
               <div>
                  <h2 class="text-2xl font-black text-on-surface">{{ selectedEnquiry.name }}</h2>
                  <p class="text-sm text-on-surface-variant font-medium">Type: {{ selectedEnquiry.type }} Lead • {{ selectedEnquiry.date | date:'longDate' }}</p>
               </div>
            </div>
            <button (click)="selectedEnquiry = null" class="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-all">
              <lucide-icon [img]="XIcon" class="w-6 h-6 text-on-surface-variant"></lucide-icon>
            </button>
          </div>

          <div class="p-8 grid md:grid-cols-[1fr_300px] gap-8">
            <div class="space-y-8">
              <!-- Content -->
              <div class="space-y-6">
                <div class="grid grid-cols-2 gap-6">
                   <div class="space-y-1">
                      <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Email Address</p>
                      <p class="font-bold text-on-surface">{{ selectedEnquiry.email }}</p>
                   </div>
                   <div class="space-y-1">
                      <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Phone Number</p>
                      <p class="font-bold text-on-surface">{{ selectedEnquiry.phone }}</p>
                   </div>
                </div>
                <div class="space-y-1">
                   <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Course Interested</p>
                   <p class="font-bold text-on-surface text-lg">{{ selectedEnquiry.course || 'Not Specified' }}</p>
                </div>
                <div class="space-y-1">
                   <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Message / Notes</p>
                   <div class="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 text-sm leading-relaxed">
                      {{ selectedEnquiry.message || 'No message provided.' }}
                   </div>
                </div>
              </div>

              <!-- Internal Notes -->
              <div class="space-y-4">
                 <h3 class="text-sm font-black uppercase tracking-widest text-on-surface-variant">Admin Notes</h3>
                 <textarea [(ngModel)]="newNote" placeholder="Add a follow-up note..." class="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/10 outline-none min-h-[100px]"></textarea>
                 <button (click)="addNote()" class="bg-primary text-white px-6 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all">Add Note</button>
              </div>
            </div>

            <!-- Sidebar Info -->
            <div class="space-y-6">
               <div class="space-y-3">
                  <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</p>
                  <select [(ngModel)]="selectedEnquiry.status" (change)="updateStatus()" class="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl p-3 text-sm font-bold outline-none">
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Closed">Closed</option>
                  </select>
               </div>

               <div class="space-y-3">
                  <p class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Assign Counsellor</p>
                  <select [(ngModel)]="selectedEnquiry.assignedTo" (change)="updateAssignment()" class="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl p-3 text-sm font-bold outline-none">
                    <option [ngValue]="undefined">Unassigned</option>
                    <option value="Maniraj">Maniraj</option>
                    <option value="Deva">Deva</option>
                    <option value="KSR Team">KSR Team</option>
                  </select>
               </div>

               <div class="p-5 rounded-2xl bg-secondary/5 border border-secondary/10">
                  <div class="flex items-center gap-2 text-secondary mb-2">
                     <lucide-icon [img]="AlertCircleIcon" class="w-4 h-4"></lucide-icon>
                     <span class="text-xs font-black uppercase tracking-widest">Next Follow-up</span>
                  </div>
                  <p class="text-sm font-bold text-on-surface">Scheduled for Tomorrow, 10:00 AM</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminEnquiriesComponent implements OnInit {
  private firebaseService = inject(FirebaseService);
  private exportService = inject(ExportService);

  readonly SearchIcon = Search;
  readonly DownloadIcon = Download;
  readonly PhoneIcon = Phone;
  readonly MessageSquareIcon = MessageSquare;
  readonly ClockIcon = Clock;
  readonly UserPlusIcon = UserPlus;
  readonly MoreIcon = MoreHorizontal;
  readonly XIcon = X;
  readonly AlertCircleIcon = AlertCircle;

  enquiries: any[] = [];
  loading = true;
  searchQuery = '';
  statusFilter = 'All';
  typeFilter = 'All';
  selectedEnquiry: any = null;
  newNote = '';

  async ngOnInit() {
    await this.loadEnquiries();
  }

  async loadEnquiries() {
    this.loading = true;
    this.enquiries = await this.firebaseService.getCollection<any>('enquiries');
    this.enquiries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.loading = false;
  }

  get filteredEnquiries() {
    return this.enquiries.filter(e => {
      const matchesSearch = !this.searchQuery || 
        e.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        e.email?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        e.course?.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All' || e.status === this.statusFilter;
      const matchesType = this.typeFilter === 'All' || e.type === this.typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  getIcon(type: string) {
    switch (type) {
      case 'Course': return MessageSquare;
      case 'Demo': return Calendar;
      case 'Call': return Phone;
      default: return MessageSquare;
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-orange-500/10 text-orange-600';
      case 'Contacted': return 'bg-blue-500/10 text-blue-600';
      case 'Enrolled': return 'bg-green-500/10 text-green-600';
      case 'Closed': return 'bg-on-surface-variant/10 text-on-surface-variant';
      default: return 'bg-surface-container text-on-surface-variant';
    }
  }

  async updateStatus() {
    if (!this.selectedEnquiry) return;
    await this.firebaseService.updateDocument('enquiries', this.selectedEnquiry.id, { status: this.selectedEnquiry.status });
  }

  async updateAssignment() {
    if (!this.selectedEnquiry) return;
    await this.firebaseService.updateDocument('enquiries', this.selectedEnquiry.id, { assignedTo: this.selectedEnquiry.assignedTo });
  }

  async addNote() {
    if (!this.newNote || !this.selectedEnquiry) return;
    const note = {
      text: this.newNote,
      date: new Date().toISOString(),
      author: 'Admin'
    };
    const notes = this.selectedEnquiry.notes || [];
    notes.push(note);
    await this.firebaseService.updateDocument('enquiries', this.selectedEnquiry.id, { notes });
    this.newNote = '';
    alert('Note added successfully!');
  }

  exportData() {
    this.exportService.exportToCsv('enquiries_export.csv', this.filteredEnquiries);
  }
}
