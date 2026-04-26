import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  badge?: string;
  price?: string;
  originalPrice?: string;
  rating?: string;
  longDescription?: string;
  syllabus?: { title: string; topics: string[] }[];
  projects?: { title: string; description: string; image?: string }[];
  trainer?: { name: string; role: string; bio: string; image?: string };
  certificate?: { title: string; description: string; image?: string };
  feesPlans?: { name: string; price: string; features: string[]; highlight?: boolean }[];
  batches?: { timing: string; days: string; startDate: string; status: string }[];
  reviews?: { studentName: string; rating: number; comment: string; date: string }[];
  faq?: { q: string; a: string }[];
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  specialization: string[];
  socials?: { platform: string; url: string }[];
}

export interface Testimonial {
  id: string;
  studentName: string;
  courseName: string;
  content: string;
  rating: number;
  imageUrl?: string;
  date: string;
}

export interface Batch {
  id: string;
  courseId: string;
  courseTitle: string;
  timing: string;
  days: string;
  startDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  status: 'Pending' | 'Contacted' | 'Closed';
  date: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrolledCourses: string[];
  joinedDate: string;
  status: 'Active' | 'Inactive';
}

export interface HomepageSection {
  id: string;
  name: string;
  type: string;
  order: number;
  visible: boolean;
  content: any;
  schema?: any;
  anchor?: string;
}

export interface ContentVersion {
  id: string;
  sectionId: string;
  content: any;
  timestamp: any;
  author: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public app = initializeApp(firebaseConfig);
  public auth = getAuth(this.app);
  // @ts-ignore
  public db = getFirestore(this.app, firebaseConfig.firestoreDatabaseId);
  private googleProvider = new GoogleAuthProvider();

  private userSubject = new BehaviorSubject<User | null>(null);
  private userProfileSubject = new BehaviorSubject<any>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  public userProfile$: Observable<any> = this.userProfileSubject.asObservable();
  private authInitPromise: Promise<void>;
  private authInitResolve!: () => void;

  constructor() {
    this.authInitPromise = new Promise(resolve => this.authInitResolve = resolve);

    onAuthStateChanged(this.auth, async (u) => {
      this.userSubject.next(u);
      if (u) {
        const userRef = doc(this.db, 'users', u.uid);
        let userSnap = await getDoc(userRef);
        let profileData: any;
        if (!userSnap.exists()) {
          profileData = {
            uid: u.uid,
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            role: u.email === 'manirajmca.ac@gmail.com' ? 'admin' : 'student'
          };
          await setDoc(userRef, profileData);
        } else {
          profileData = userSnap.data();
          if (u.email === 'manirajmca.ac@gmail.com' && profileData.role !== 'admin') {
            profileData.role = 'admin';
            await setDoc(userRef, profileData, { merge: true });
          }
        }
        this.userProfileSubject.next(profileData);
      } else {
        this.userProfileSubject.next(null);
      }
      this.authInitResolve();
    });
  }

  get user() {
    return this.userSubject.value;
  }

  get userProfile() {
    return this.userProfileSubject.value;
  }

  waitForAuthInit() {
    return this.authInitPromise;
  }

  async signInWithGoogle() {
    try {
      await signInWithPopup(this.auth, this.googleProvider);
    } catch (err) {
      console.error(err);
    }
  }

  logout() {
    return signOut(this.auth);
  }

  // Generic CRUD
  async getCollection<T>(collectionName: string): Promise<T[]> {
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
    let q = query(collection(this.db, collectionName));
    
    // Sort by order if it's homepage sections
    if (collectionName === 'homepage_sections') {
      q = query(collection(this.db, collectionName), orderBy('order', 'asc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
  }

  async addDocument(collectionName: string, data: any): Promise<string> {
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(this.db, collectionName), data);
    return docRef.id;
  }

  async updateDocument(collectionName: string, id: string, data: any, saveHistory = false): Promise<void> {
    const { doc, updateDoc, collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const docRef = doc(this.db, collectionName, id);
    
    if (saveHistory && collectionName === 'homepage_sections' && data.content) {
      await addDoc(collection(this.db, 'section_history'), {
        sectionId: id,
        content: data.content,
        timestamp: serverTimestamp(),
        author: this.userProfile?.displayName || 'Admin'
      });
    }

    return updateDoc(docRef, data);
  }

  async getHistory(sectionId: string): Promise<ContentVersion[]> {
    const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
    const historyRef = collection(this.db, 'section_history');
    const q = query(historyRef, where('sectionId', '==', sectionId), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as ContentVersion));
  }

  async deleteDocument(collectionName: string, id: string): Promise<void> {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const docRef = doc(this.db, collectionName, id);
    return deleteDoc(docRef);
  }

  // Specialized methods
  async getCourses(): Promise<Course[]> {
    return this.getCollection<Course>('courses');
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    const { collection, query, where, getDocs, limit } = await import('firebase/firestore');
    const coursesRef = collection(this.db, 'courses');
    const q = query(coursesRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Course;
  }
}
