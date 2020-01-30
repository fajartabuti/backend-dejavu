import { Injectable } from '@angular/core';
import { Match } from './match';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class MatchService {
  matchesRef: AngularFireList<any>;
  matchRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {}

  AddMatch(match: Match) {
    this.matchesRef.push({
      match_type: match.match_type,
      division: match.division,
      match_title: match.match_title,
      match_date: match.match_date,
      rival_logo: match.rival_logo,
      logo_id: match.logo_id
    })
    .catch(error => {
      this.errorMgmt(error);
    })
  }

  GetMatch(id: string) {
    this.matchRef = this.db.object('matches-list/' + id);
    return this.matchRef;
  }  

  GetMatchList() {
    this.matchesRef = this.db.list('matches-list');
    return this.matchesRef;
  }

  UpdateMatch(match: Match) {
    this.matchRef.update({
      match_type: match.match_type,
      division: match.division,
      match_title: match.match_title,
      match_date: match.match_date, 
      rival_logo: match.rival_logo,
      logo_id: match.logo_id
    })
    .catch(error => {
      this.errorMgmt(error);
    })
  }

  DeleteMatch(id: string) {
    this.matchRef = this.db.object('matches-list/' + id);
    this.matchRef.remove()
    .catch(error => {
      this.errorMgmt(error);
    })
  }

  // Error management
  private errorMgmt(error) {
    console.log(error)
  }
}