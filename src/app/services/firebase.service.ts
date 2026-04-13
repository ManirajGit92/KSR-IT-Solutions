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
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, async (u) => {
      this.userSubject.next(u);
      if (u) {
        const userRef = doc(this.db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: u.uid,
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            role: 'student'
          });
        }
      }
    });
  }

  get user() {
    return this.userSubject.value;
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
