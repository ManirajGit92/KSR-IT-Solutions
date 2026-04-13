import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  await firebaseService.waitForAuthInit();

  if (firebaseService.user) {
    return true;
  }
  return router.parseUrl('/');
};
