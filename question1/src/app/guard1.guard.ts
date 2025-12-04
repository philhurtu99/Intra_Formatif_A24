import { CanActivateFn, createUrlTreeFromSnapshot  } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';

export const guard1Guard: CanActivateFn = (route, state) => {
  if(!inject(UserService).currentUser)
    return createUrlTreeFromSnapshot(route, ["/login"]);
  else return true;
};
