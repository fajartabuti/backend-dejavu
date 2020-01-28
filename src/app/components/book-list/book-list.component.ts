import { Book } from './../../shared/book';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { BookService } from './../../shared/book.service';
import { MatDialog } from '@angular/material/dialog';
import { AddBookComponent } from '../add-book/add-book.component';
import { EditBookComponent } from '../edit-book/edit-book.component';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent implements OnInit{
  dataSource: MatTableDataSource<Book>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  BookData: any = [];
  displayedColumns: any[] = [
    // '$key',
    'match_date',
    'match_type',
    'match_title',
    // 'book_name',
    // 'author_name', 
    // 'publication_date',
    'action'
  ];
  
  constructor(
    private dataService:DataService,
    private bookApi: BookService,
    public dialog: MatDialog){
    this.bookApi.GetBookList()
    .snapshotChanges().subscribe(books => {
        this.BookData = [];
        books.forEach(item => {
          let a = item.payload.toJSON();
          a['$key'] = item.key;
          this.BookData.push(a as Book)
        })
        /* Data table */
        this.dataSource = new MatTableDataSource(this.BookData);
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
    const dialogRef = this.dialog.open(AddBookComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(e) {
    this.dataService.setData(e);
    const dialogRef = this.dialog.open(EditBookComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /* Delete */
  deleteBook(index: number, e){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.bookApi.DeleteBook(e.$key)
    }
  }
}