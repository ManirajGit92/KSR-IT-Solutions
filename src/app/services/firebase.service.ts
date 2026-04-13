import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  badge?: string;
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
}
