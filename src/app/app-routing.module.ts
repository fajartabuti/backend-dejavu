import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMatchComponent } from './components/add-match/add-match.component';
import { MatchListComponent } from './components/match-list/match-list.component';
import { EditMatchComponent } from './components/edit-match/edit-match.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'matches-list' },
  { path: 'add-match', component: AddMatchComponent, canActivate: [AuthGuard]},
  { path: 'edit-match/:id', component: EditMatchComponent, canActivate: [AuthGuard] },
  { path: 'matches-list', component: MatchListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }