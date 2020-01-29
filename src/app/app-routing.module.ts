import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMatchComponent } from './components/add-match/add-match.component';
import { MatchListComponent } from './components/match-list/match-list.component';
import { EditMatchComponent } from './components/edit-match/edit-match.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'matches-list' },
  { path: 'add-match', component: AddMatchComponent },
  { path: 'edit-match/:id', component: EditMatchComponent },
  { path: 'matches-list', component: MatchListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }