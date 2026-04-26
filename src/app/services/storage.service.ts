import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = getStorage(this.firebaseService.app);

  constructor(private firebaseService: FirebaseService) { }

  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }

  async deleteFile(url: string): Promise<void> {
    const fileRef = ref(this.storage, url);
    return deleteObject(fileRef);
  }
}
