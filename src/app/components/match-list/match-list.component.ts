import { Match } from '../../shared/match';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatchService } from '../../shared/match.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMatchComponent } from '../add-match/add-match.component';
import { EditMatchComponent } from '../edit-match/edit-match.component';
import { DataService } from '../../shared/data.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})

export class MatchListComponent implements OnInit{
  dataSource: MatTableDataSource<Match>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  MatchData: any = [];
  displayedColumns: any[] = [
    // '$key',
    'match_date',
    'division',
    'match_type',
    'match_title',
    'action'
  ];
  
  constructor(
    private storage: AngularFireStorage,
    private dataService:DataService,
    private matchApi: MatchService,
    public dialog: MatDialog){
    this.matchApi.GetMatchList()
    .snapshotChanges().subscribe(matches => {
        this.MatchData = [];
        matches.forEach(item => {
          let a = item.payload.toJSON();
          a['$key'] = item.key;
          this.MatchData.push(a as Match)
        })
        /* Data table */
        this.dataSource = new MatTableDataSource(this.MatchData);
        /* Pagination */
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }, 0);
    })
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddMatchComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(e) {
    this.dataService.setData(e);
    const dialogRef = this.dialog.open(EditMatchComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /* Delete */
  deleteMatch(index: number, e){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      
      if (e.logo_id != ''){
        this.storage.ref(e.logo_id).delete();
      }
      
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.matchApi.DeleteMatch(e.$key)
    }
  }
}