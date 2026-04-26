import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';

export interface AnalyticsEvent {
  type: 'page_view' | 'click' | 'enquiry' | 'search';
  category?: string;
  label?: string;
  value?: any;
  timestamp: any;
  sessionId: string;
  device: string;
  path: string;
}

export interface CourseStats {
  name: string;
  views: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private firebaseService = inject(FirebaseService);
  private sessionId = this.getOrCreateSessionId();

  private getOrCreateSessionId() {
    let id = localStorage.getItem('ksr_session_id');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('ksr_session_id', id);
      localStorage.setItem('ksr_session_start', Date.now().toString());
    }
    return id;
  }

  async trackEvent(type: AnalyticsEvent['type'], category?: string, label?: string, value?: any) {
    const { serverTimestamp } = await import('firebase/firestore');
    
    const event: any = {
      type,
      category: category || null,
      label: label || null,
      value: value || null,
      timestamp: serverTimestamp(),
      sessionId: this.sessionId,
      device: this.getDeviceType(),
      path: window.location.pathname
    };

    // Remove undefined fields just in case
    Object.keys(event).forEach(key => event[key] === undefined && delete event[key]);

    try {
      await this.firebaseService.addDocument('analytics_events', event);
      await this.updateDailyStats(type, label);
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }

  private getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) return 'Mobile';
    return 'Desktop';
  }

  private async updateDailyStats(type: string, label?: string) {
    const date = new Date().toISOString().split('T')[0];
    const { doc, getDoc, setDoc, increment } = await import('firebase/firestore');
    const statsRef = doc(this.firebaseService.db, 'analytics_daily', date);
    
    const updateData: any = {
      [type + '_count']: increment(1)
    };

    if (type === 'page_view' && label) {
      const sanitizedLabel = label.replace(/[/.]/g, '_').replace(/^_+|_+$/g, '') || 'root';
      updateData[`views_${sanitizedLabel}`] = increment(1);
    }

    try {
      const snap = await getDoc(statsRef);
      if (!snap.exists()) {
        await setDoc(statsRef, { date, ...updateData }, { merge: true });
      } else {
        await setDoc(statsRef, updateData, { merge: true });
      }
    } catch (err) {
       // Ignore silent errors in stats
    }
  }

  async getDailyStats(limit = 30) {
    const { collection, query, orderBy, limit: limitCount, getDocs } = await import('firebase/firestore');
    const q = query(collection(this.firebaseService.db, 'analytics_daily'), orderBy('date', 'desc'), limitCount(limit));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
  }

  async getPopularCourses(): Promise<CourseStats[]> {
     const stats = await this.getDailyStats(7);
     const courses: Record<string, number> = {};
     stats.forEach((day: any) => {
       Object.keys(day).forEach(key => {
         if (key.startsWith('views_course_')) {
           const course = key.replace('views_course_', '');
           courses[course] = (courses[course] || 0) + (day[key] as number);
         }
       });
     });
     return Object.entries(courses)
       .map(([name, views]) => ({ name, views }))
       .sort((a, b) => b.views - a.views);
  }
}
