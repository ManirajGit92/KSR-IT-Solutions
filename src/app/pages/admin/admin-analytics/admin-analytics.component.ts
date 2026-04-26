import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../services/analytics.service';
import { LucideAngularModule, TrendingUp, Users, Eye, MousePointer2, Smartphone, Monitor, Tablet, MapPin, Search } from 'lucide-angular';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="space-y-8 animate-fade-in-up">
      <!-- Header -->
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Insights & Trends</p>
        <h1 class="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Platform Analytics</h1>
        <p class="mt-2 text-sm text-on-surface-variant font-medium">Real-time tracking of visitors, engagement, and conversion metrics.</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article *ngFor="let stat of quickStats" class="glass p-6 rounded-[32px] border border-outline-variant/10 group hover:border-primary/40 transition-all">
          <div class="flex items-center justify-between mb-4">
            <div [class]="'w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ' + stat.color">
              <lucide-icon [img]="stat.icon" class="w-6 h-6"></lucide-icon>
            </div>
            <span class="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">+{{ stat.growth }}%</span>
          </div>
          <h3 class="text-2xl font-black text-on-surface">{{ stat.value }}</h3>
          <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">{{ stat.label }}</p>
        </article>
      </div>

      <!-- Charts Row -->
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Traffic Chart -->
        <div class="glass p-8 rounded-[40px] border border-outline-variant/10 h-[450px] flex flex-col">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-lg font-black text-on-surface">Visitor Traffic</h3>
            <select class="bg-surface-container-high border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div class="flex-1 relative">
            <canvas #trafficChart></canvas>
          </div>
        </div>

        <!-- Device Distribution -->
        <div class="glass p-8 rounded-[40px] border border-outline-variant/10 h-[450px] flex flex-col">
          <h3 class="text-lg font-black text-on-surface mb-8">Device Breakdown</h3>
          <div class="flex-1 relative flex items-center justify-center">
             <canvas #deviceChart class="max-w-[300px]"></canvas>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-8">
             <div *ngFor="let dev of devices" class="text-center">
                <lucide-icon [img]="dev.icon" class="w-5 h-5 mx-auto mb-2 text-on-surface-variant"></lucide-icon>
                <p class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{{ dev.label }}</p>
                <p class="text-sm font-bold text-on-surface">{{ dev.percent }}%</p>
             </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Course Views & Top Keywords -->
      <div class="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        <!-- Popular Courses -->
        <div class="glass p-8 rounded-[40px] border border-outline-variant/10">
          <h3 class="text-lg font-black text-on-surface mb-8">Most Viewed Courses</h3>
          <div class="space-y-6">
            <div *ngFor="let course of popularCourses" class="group">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-bold text-on-surface group-hover:text-primary transition-colors uppercase tracking-tight">{{ course.name }}</h4>
                <span class="text-xs font-black text-on-surface-variant">{{ course.views }} views</span>
              </div>
              <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" [style.width.%]="course.percent"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Keywords / Locations -->
        <div class="glass p-8 rounded-[40px] border border-outline-variant/10">
          <h3 class="text-lg font-black text-on-surface mb-8">Top Keywords</h3>
          <div class="flex flex-wrap gap-3">
             <span *ngFor="let kw of keywords" class="px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all cursor-default border border-outline-variant/5">
                {{ kw }}
             </span>
          </div>

          <h3 class="text-lg font-black text-on-surface mt-12 mb-8">Traffic by Location</h3>
          <div class="space-y-4">
             <div *ngFor="let loc of locations" class="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                <div class="flex items-center gap-3">
                   <lucide-icon [img]="MapPinIcon" class="w-4 h-4 text-secondary"></lucide-icon>
                   <span class="text-sm font-bold text-on-surface">{{ loc.city }}</span>
                </div>
                <span class="text-xs font-black text-on-surface-variant">{{ loc.count }}%</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminAnalyticsComponent implements OnInit, AfterViewInit {
  private analytics = inject(AnalyticsService);

  @ViewChild('trafficChart') trafficCanvas!: ElementRef;
  @ViewChild('deviceChart') deviceCanvas!: ElementRef;

  readonly TrendingUpIcon = TrendingUp;
  readonly UsersIcon = Users;
  readonly EyeIcon = Eye;
  readonly MousePointerIcon = MousePointer2;
  readonly SmartphoneIcon = Smartphone;
  readonly MonitorIcon = Monitor;
  readonly TabletIcon = Tablet;
  readonly MapPinIcon = MapPin;
  readonly SearchIcon = Search;

  quickStats = [
    { label: 'Total Visitors', value: '12,482', icon: Users, color: 'bg-blue-500', growth: 12 },
    { label: 'Page Views', value: '45,290', icon: Eye, color: 'bg-purple-500', growth: 8 },
    { label: 'Enquiries', value: '842', icon: MousePointer2, color: 'bg-secondary', growth: 15 },
    { label: 'Conversion', value: '3.4%', icon: TrendingUp, color: 'bg-green-500', growth: 2 }
  ];

  devices = [
    { label: 'Desktop', icon: Monitor, percent: 58 },
    { label: 'Mobile', icon: Smartphone, percent: 35 },
    { label: 'Tablet', icon: Tablet, percent: 7 }
  ];

  popularCourses = [
    { name: 'Full Stack Web Development', views: 2405, percent: 95 },
    { name: 'Cloud Computing (AWS/Azure)', views: 1842, percent: 78 },
    { name: 'Data Engineering with Python', views: 1520, percent: 65 },
    { name: 'Cyber Security Essentials', views: 980, percent: 45 },
    { name: 'UI/UX Design Masterclass', views: 750, percent: 35 }
  ];

  keywords = ['Best IT Training Hyderabad', 'Full Stack Java Course', 'Cloud Certification', 'Python Data Science', 'AWS Training Online', 'React JS Masterclass', 'KSR IT Reviews'];
  
  locations = [
    { city: 'Hyderabad', count: 42 },
    { city: 'Bangalore', count: 18 },
    { city: 'Chennai', count: 12 },
    { city: 'Pune', count: 8 },
    { city: 'Online (Global)', count: 20 }
  ];

  async ngOnInit() {
    this.loadRealData();
  }

  async loadRealData() {
    try {
      const realCourses = await this.analytics.getPopularCourses();
      if (realCourses && realCourses.length > 0) {
        const maxViews = Math.max(...realCourses.map(c => Number(c.views) || 0));
        if (maxViews > 0) {
          this.popularCourses = realCourses.map(c => ({
            name: c.name,
            views: Number(c.views) || 0,
            percent: Math.round(((Number(c.views) || 0) / maxViews) * 100)
          }));
        }
      }

      const dailyStats = await this.analytics.getDailyStats(7);
      if (dailyStats && dailyStats.length > 0) {
        this.updateStatsFromDaily(dailyStats);
      }
    } catch (err) {
      console.warn('Using mock data for analytics:', err);
    }
  }

  private updateStatsFromDaily(stats: any[]) {
     // Aggregate stats from the last 7 days
     let totalViews = 0;
     let totalEnquiries = 0;
     stats.forEach(day => {
       totalViews += (day.page_view_count || 0);
       totalEnquiries += (day.enquiry_count || 0);
     });

     this.quickStats[1].value = totalViews.toLocaleString();
     this.quickStats[2].value = totalEnquiries.toLocaleString();
  }

  ngAfterViewInit() {
    this.initTrafficChart();
    this.initDeviceChart();
  }

  private initTrafficChart() {
    new Chart(this.trafficCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Visitors',
          data: [1200, 1900, 1500, 2100, 1800, 2400, 2100],
          borderColor: '#E65100',
          backgroundColor: 'rgba(230, 81, 0, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#E65100'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  private initDeviceChart() {
    new Chart(this.deviceCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
          data: [58, 35, 7],
          backgroundColor: ['#E65100', '#000000', '#666666'],
          borderWidth: 0,
          cutout: '75%'
        } as any]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
}
