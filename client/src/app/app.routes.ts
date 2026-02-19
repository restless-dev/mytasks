import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from '././features/auth/signup/signup.component';
import { authGuard } from './core/guards/auth.guard';
import { BoardLayoutComponent } from './features/boards/layout/board-layout/board-layout.component';
import { BoardViewComponent } from './features/boards/pages/board-view/board-view.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'boards',
    component: BoardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: ':id',
        component: BoardViewComponent,
      },
    ],
  },

  { path: '', redirectTo: 'boards', pathMatch: 'full' },
];
