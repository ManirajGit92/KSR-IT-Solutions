import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LucideAngularModule, GripVertical, Eye, EyeOff, Pencil, Plus, Trash2, Save, X, History, Code, Layout, RotateCcw, AlertCircle, CheckCircle2, Calendar, HelpCircle } from 'lucide-angular';
import { FirebaseService, HomepageSection, ContentVersion } from '../../../services/firebase.service';

@Component({
  selector: 'app-admin-sections',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DragDropModule, FormsModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Advanced CMS</p>
          <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Content Management</h1>
          <p class="mt-2 text-sm text-on-surface-variant font-medium">Manage every section via JSON, visual forms, and version rollbacks.</p>
        </div>
        <div class="flex gap-3">
          <button (click)="addSection()" class="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:translate-y-0">
            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> New Section
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let i of [1,2,3,4]" class="glass h-24 rounded-2xl animate-pulse bg-surface-container-low"></div>
      </div>

      <!-- Main Content Split -->
      <div *ngIf="!loading" class="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
        
        <!-- Sidebar: Section List -->
        <aside class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h2 class="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Active Sections</h2>
            <span class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{{ sections.length }} TOTAL</span>
          </div>
          
          <div cdkDropList (cdkDropListDropped)="drop($event)" class="space-y-3">
            <article *ngFor="let section of sections; let i = index" 
                     cdkDrag
                     (click)="selectSection(section)"
                     class="group glass rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden relative"
                     [ngClass]="selectedSection?.id === section.id ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20' : 'border-outline-variant/10 hover:border-primary/20'">
              
              <div *cdkDragPlaceholder class="glass rounded-2xl border border-primary/20 bg-primary/5 h-16 w-full"></div>
              
              <div class="p-4 flex items-center gap-3">
                <div cdkDragHandle class="cursor-grab text-on-surface-variant/30 hover:text-on-surface-variant transition-colors">
                  <lucide-icon [img]="GripVerticalIcon" class="w-4 h-4"></lucide-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-bold text-on-surface truncate">{{ section.name }}</h3>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">{{ section.type }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <lucide-icon *ngIf="section.visible" [img]="EyeIcon" class="w-3.5 h-3.5 text-green-500"></lucide-icon>
                  <lucide-icon *ngIf="!section.visible" [img]="EyeOffIcon" class="w-3.5 h-3.5 text-on-surface-variant/40"></lucide-icon>
                </div>
              </div>
            </article>
          </div>
          
          <div *ngIf="orderChanged" class="pt-4">
             <button (click)="saveOrder()" class="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-black text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon> SAVE ORDER
             </button>
          </div>
        </aside>

        <!-- Main Editor Area -->
        <main class="space-y-6">
          <ng-container *ngIf="selectedSection; else noSelection">
            <div class="glass rounded-3xl border border-outline-variant/10 overflow-hidden shadow-2xl animate-fade-in-up">
              <!-- Editor Header -->
              <div class="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg">
                    <lucide-icon [img]="LayoutIcon" class="w-6 h-6"></lucide-icon>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-on-surface">{{ selectedSection.name }}</h2>
                    <div class="flex items-center gap-3 mt-1">
                      <p class="text-xs text-on-surface-variant font-medium">Type: {{ selectedSection.type }}</p>
                      <div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/10">
                        <span class="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Anchor:</span>
                        <input [(ngModel)]="selectedSection.anchor" 
                               placeholder="e.g. hero"
                               class="bg-transparent border-none text-[10px] font-bold text-primary focus:outline-none w-20">
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Mode Toggles -->
                <div class="flex items-center p-1 bg-surface-container rounded-xl border border-outline-variant/10">
                  <button (click)="editorMode = 'form'" 
                          [ngClass]="editorMode === 'form' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'"
                          class="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
                    <lucide-icon [img]="LayoutIcon" class="w-3.5 h-3.5"></lucide-icon> Form
                  </button>
                  <button (click)="editorMode = 'json'" 
                          [ngClass]="editorMode === 'json' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'"
                          class="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
                    <lucide-icon [img]="CodeIcon" class="w-3.5 h-3.5"></lucide-icon> JSON
                  </button>
                  <button (click)="loadHistory()" 
                          [ngClass]="editorMode === 'history' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'"
                          class="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all relative">
                    <lucide-icon [img]="HistoryIcon" class="w-3.5 h-3.5"></lucide-icon> History
                    <span *ngIf="history.length" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[8px] text-white flex items-center justify-center border-2 border-white shadow-sm">{{ history.length }}</span>
                  </button>
                </div>
              </div>

              <!-- Editor Body -->
              <div class="p-8 min-h-[400px]">
                <!-- JSON MODE -->
                <div *ngIf="editorMode === 'json'" class="space-y-4 animate-scale-in">
                  <div class="relative group">
                    <textarea [(ngModel)]="editContentJson" 
                              (ngModelChange)="validateJson()"
                              rows="18" 
                              class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-inner"></textarea>
                    
                    <!-- Validation Indicator -->
                    <div class="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-all shadow-sm"
                         [ngClass]="jsonError ? 'bg-error/10 text-error border border-error/20' : 'bg-green-500/10 text-green-600 border border-green-500/20'">
                      <lucide-icon [img]="jsonError ? AlertCircleIcon : CheckCircleIcon" class="w-3 h-3"></lucide-icon>
                      {{ jsonError ? 'Invalid JSON' : 'Valid Format' }}
                    </div>
                  </div>
                  <p *ngIf="jsonError" class="text-error text-xs font-bold pl-2 flex items-center gap-2">
                    <lucide-icon [img]="AlertCircleIcon" class="w-3.5 h-3.5"></lucide-icon> {{ jsonError }}
                  </p>
                </div>

                <!-- FORM MODE -->
                <div *ngIf="editorMode === 'form'" class="grid gap-6 animate-scale-in">
                  <div *ngFor="let key of getContentKeys()" class="space-y-2">
                    <div class="flex items-center justify-between px-1">
                      <label class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">{{ key.replace('_', ' ') }}</label>
                      <span class="text-[9px] font-bold text-on-surface-variant/40 bg-surface-container-high px-2 py-0.5 rounded uppercase">{{ typeof(selectedSection.content[key]) }}</span>
                    </div>
                    
                    <textarea *ngIf="typeof(selectedSection.content[key]) === 'string' && selectedSection.content[key].length > 50"
                              [(ngModel)]="selectedSection.content[key]"
                              rows="3"
                              class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"></textarea>
                    
                    <input *ngIf="typeof(selectedSection.content[key]) === 'string' && selectedSection.content[key].length <= 50"
                           [(ngModel)]="selectedSection.content[key]"
                           type="text"
                           class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all">
                    
                    <input *ngIf="typeof(selectedSection.content[key]) === 'number'"
                           [(ngModel)]="selectedSection.content[key]"
                           type="number"
                           class="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all">

                    <div *ngIf="typeof(selectedSection.content[key]) === 'boolean'" class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10">
                      <input type="checkbox" [(ngModel)]="selectedSection.content[key]" class="w-5 h-5 accent-primary">
                      <span class="text-sm font-bold text-on-surface">{{ selectedSection.content[key] ? 'Enabled' : 'Disabled' }}</span>
                    </div>
                  </div>
                </div>

                <!-- HISTORY MODE -->
                <div *ngIf="editorMode === 'history'" class="space-y-4 animate-scale-in">
                   <div *ngIf="historyLoading" class="flex flex-col items-center justify-center py-12 text-on-surface-variant opacity-50">
                     <div class="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4"></div>
                     <p class="text-xs font-bold uppercase tracking-widest">Fetching versions...</p>
                   </div>
                   
                   <div *ngIf="!historyLoading && !history.length" class="flex flex-col items-center justify-center py-12 text-on-surface-variant opacity-50">
                     <lucide-icon [img]="HistoryIcon" class="w-12 h-12 mb-4"></lucide-icon>
                     <p class="text-xs font-bold uppercase tracking-widest">No previous versions found</p>
                   </div>

                   <article *ngFor="let version of history" class="glass rounded-2xl border border-outline-variant/10 p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-all">
                     <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                         <lucide-icon [img]="RotateCcwIcon" class="w-5 h-5"></lucide-icon>
                       </div>
                       <div>
                         <h4 class="text-sm font-black text-on-surface">{{ version.timestamp?.toDate() | date:'medium' }}</h4>
                         <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Modified by {{ version.author }}</p>
                       </div>
                     </div>
                     <button (click)="rollback(version)" class="bg-primary/10 text-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                       Rollback
                     </button>
                   </article>
                </div>
              </div>

              <!-- Editor Footer -->
              <div class="p-6 border-t border-outline-variant/10 bg-surface-container/30 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <button (click)="toggleVisibility(selectedSection)" 
                          [ngClass]="selectedSection.visible ? 'text-green-500 bg-green-500/10' : 'text-on-surface-variant bg-surface-container'"
                          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-transparent hover:border-current">
                    <lucide-icon [img]="selectedSection.visible ? EyeIcon : EyeOffIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ selectedSection.visible ? 'Published' : 'Hidden' }}
                  </button>
                  <button (click)="deleteSection(selectedSection.id)" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-error bg-error/10 hover:bg-error hover:text-white transition-all">
                    Delete Section
                  </button>
                </div>
                <button (click)="saveSelectedContent()" 
                        [disabled]="jsonError"
                        class="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-black text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:grayscale">
                  <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon> PUBLISH CHANGES
                </button>
              </div>
            </div>
          </ng-container>

          <ng-template #noSelection>
            <div class="glass rounded-3xl border border-outline-variant/10 border-dashed p-20 flex flex-col items-center justify-center text-center">
              <div class="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center text-on-surface-variant/20 mb-6">
                <lucide-icon [img]="LayoutIcon" class="w-10 h-10"></lucide-icon>
              </div>
              <h2 class="text-xl font-bold text-on-surface opacity-50">No Section Selected</h2>
              <p class="mt-2 text-sm text-on-surface-variant opacity-60 max-w-xs">Select a section from the sidebar to begin editing its content.</p>
            </div>
          </ng-template>
        </main>
      </div>

      <!-- Template Selection Modal -->
      <div *ngIf="showTemplateModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
        <div class="absolute inset-0 bg-surface/80 backdrop-blur-md" (click)="showTemplateModal = false"></div>
        <div class="relative w-full max-w-4xl glass rounded-[40px] border border-outline-variant/20 shadow-2xl overflow-hidden animate-scale-in">
          <div class="p-8 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container/30">
            <div>
              <h2 class="text-2xl font-black text-on-surface tracking-tight">Create New Section</h2>
              <p class="text-sm text-on-surface-variant font-medium">Choose a template to instantly add a new section to your homepage.</p>
            </div>
            <button (click)="showTemplateModal = false" class="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-surface-container-high transition-all">
              <lucide-icon [img]="XIcon" class="w-6 h-6 text-on-surface-variant"></lucide-icon>
            </button>
          </div>

          <div class="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto">
            <button *ngFor="let template of TEMPLATES" 
                    (click)="addSection(template)"
                    class="group p-6 rounded-[32px] border border-outline-variant/10 bg-surface-container-low hover:border-primary/40 hover:bg-primary/5 transition-all text-left flex flex-col gap-4">
              <div class="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <lucide-icon [img]="template.icon" class="w-7 h-7"></lucide-icon>
              </div>
              <div>
                <h3 class="font-bold text-on-surface group-hover:text-primary transition-colors">{{ template.name }}</h3>
                <p class="text-xs text-on-surface-variant font-medium mt-1">Type: {{ template.type }}</p>
              </div>
              <div class="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Select Template <lucide-icon [img]="PlusIcon" class="w-3 h-3"></lucide-icon>
              </div>
            </button>
          </div>
          
          <div class="p-8 bg-surface-container/20 border-t border-outline-variant/10 text-center">
             <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">More templates coming soon</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminSectionsComponent implements OnInit {
  private firebaseService = inject(FirebaseService);

  readonly GripVerticalIcon = GripVertical;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly PencilIcon = Pencil;
  readonly PlusIcon = Plus;
  readonly TrashIcon = Trash2;
  readonly SaveIcon = Save;
  readonly XIcon = X;
  readonly HistoryIcon = History;
  readonly CodeIcon = Code;
  readonly LayoutIcon = Layout;
  readonly RotateCcwIcon = RotateCcw;
  readonly AlertCircleIcon = AlertCircle;
  readonly CheckCircleIcon = CheckCircle2;

  sections: HomepageSection[] = [];
  loading = true;
  orderChanged = false;
  
  selectedSection: HomepageSection | null = null;
  editorMode: 'json' | 'form' | 'history' = 'form';
  editContentJson = '';
  jsonError = '';
  
  history: ContentVersion[] = [];
  historyLoading = false;

  showTemplateModal = false;
  readonly TEMPLATES = [
    { 
      type: 'hero', 
      name: 'Main Hero Banner', 
      icon: Layout,
      content: { 
        title: 'Transform Your Career with KSR IT', 
        subtitle: 'Learn from industry experts and get job-ready with our comprehensive courses.', 
        buttonText: 'Explore Courses',
        buttonLink: '#courses',
        bgImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80'
      } 
    },
    { 
      type: 'offer', 
      name: 'Promotional Offer', 
      icon: Plus,
      content: { 
        title: 'Summer Special Offer', 
        discount: '20% OFF', 
        description: 'Get exclusive discounts on all professional certifications this month.',
        expiryDate: '2026-05-31',
        buttonText: 'Claim Now'
      } 
    },
    { 
      type: 'stats', 
      name: 'Statistics Section', 
      icon: CheckCircle2,
      content: { 
        title: 'Our Impact in Numbers',
        stats: [
          { label: 'Students Placed', value: '5000+', icon: 'users' },
          { label: 'Expert Trainers', value: '50+', icon: 'award' },
          { label: 'Courses Offered', value: '30+', icon: 'book' }
        ]
      } 
    },
    { 
      type: 'video', 
      name: 'Video Showcase', 
      icon: Code,
      content: { 
        title: 'Watch Our Success Stories',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80'
      } 
    },
    { 
      type: 'gallery', 
      name: 'Image Gallery', 
      icon: Layout,
      content: { 
        title: 'Life at KSR IT',
        images: [
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80'
        ]
      } 
    },
    {
      type: 'batches',
      name: 'Upcoming Batches',
      icon: Calendar,
      content: {
        title: 'Upcoming <span class="text-gradient">Batches</span>',
        subtitle: 'Join our professional training programs. Limited seats available.'
      }
    },
    {
      type: 'faq',
      name: 'FAQ Section',
      icon: HelpCircle,
      content: {
        title: 'Frequently Asked <span class="text-gradient">Questions</span>',
        subtitle: 'Everything you need to know about our training and placement.'
      }
    }
  ];

  async ngOnInit() {
    await this.loadSections();
  }

  async loadSections() {
    this.loading = true;
    this.sections = await this.firebaseService.getCollection<HomepageSection>('homepage_sections');
    if (this.selectedSection) {
      const updated = this.sections.find(s => s.id === this.selectedSection!.id);
      if (updated) this.selectSection(updated);
    }
    this.loading = false;
  }

  selectSection(section: HomepageSection) {
    this.selectedSection = { ...section, content: { ...section.content } };
    this.editContentJson = JSON.stringify(section.content || {}, null, 2);
    this.jsonError = '';
    this.history = [];
    if (this.editorMode === 'history') this.loadHistory();
  }

  getContentKeys() {
    return this.selectedSection ? Object.keys(this.selectedSection.content) : [];
  }

  typeof(val: any) {
    return typeof val;
  }

  validateJson() {
    try {
      JSON.parse(this.editContentJson);
      this.jsonError = '';
    } catch (e: any) {
      this.jsonError = e.message;
    }
  }

  async loadHistory() {
    if (!this.selectedSection) return;
    this.editorMode = 'history';
    this.historyLoading = true;
    this.history = await this.firebaseService.getHistory(this.selectedSection.id);
    this.historyLoading = false;
  }

  async rollback(version: ContentVersion) {
    if (confirm('Rollback to this version? Current changes will be overwritten.')) {
      this.selectedSection!.content = version.content;
      this.editContentJson = JSON.stringify(version.content, null, 2);
      await this.saveSelectedContent();
      this.editorMode = 'form';
    }
  }

  async saveSelectedContent() {
    if (!this.selectedSection) return;
    
    if (this.editorMode === 'json') {
      try {
        this.selectedSection.content = JSON.parse(this.editContentJson);
      } catch (e) {
        return;
      }
    }

    this.loading = true;
    await this.firebaseService.updateDocument('homepage_sections', this.selectedSection.id, { 
      content: this.selectedSection.content,
      visible: this.selectedSection.visible,
      anchor: this.selectedSection.anchor || ''
    }, true);
    
    await this.loadSections();
    this.loading = false;
    alert('Changes published successfully!');
  }

  drop(event: CdkDragDrop<HomepageSection[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    this.orderChanged = true;
  }

  async saveOrder() {
    this.loading = true;
    for (let i = 0; i < this.sections.length; i++) {
      await this.firebaseService.updateDocument('homepage_sections', this.sections[i].id, { order: i });
    }
    this.orderChanged = false;
    await this.loadSections();
  }

  async toggleVisibility(section: HomepageSection) {
    section.visible = !section.visible;
    await this.firebaseService.updateDocument('homepage_sections', section.id, { visible: section.visible });
    if (this.selectedSection?.id === section.id) this.selectedSection.visible = section.visible;
  }

  async addSection(template?: any) {
    if (!template) {
      this.showTemplateModal = true;
      return;
    }

    this.loading = true;
    const newSection = {
      name: template.name,
      type: template.type,
      order: this.sections.length,
      visible: true,
      content: template.content,
      anchor: template.type
    };

    await this.firebaseService.addDocument('homepage_sections', newSection);
    this.showTemplateModal = false;
    await this.loadSections();
    this.loading = false;
  }

  async deleteSection(id: string) {
    if (confirm('Delete this section?')) {
      await this.firebaseService.deleteDocument('homepage_sections', id);
      this.selectedSection = null;
      await this.loadSections();
    }
  }
}
