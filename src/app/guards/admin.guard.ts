import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  // We wait directly if the service exposes an async getter for profile
  await firebaseService.waitForAuthInit();
  
  const profile = firebaseService.userProfile;
  if (profile && profile.role === 'admin') {
    return true;
  }
  return router.parseUrl('/');
};
