import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';

export const guard1Guard: CanActivateFn = (route, state) => {
  if(!inject(UserService).currentUser)
    return createUrlTreeFromSnapshot(route, ["/login"]);
  else return true;
};

