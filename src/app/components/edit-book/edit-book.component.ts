import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { BookService } from './../../shared/book.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService } from '../../shared/data.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface Language {
  name: string;
}

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})

export class EditBookComponent implements OnInit {
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;
  public selected: any;
  data = this.dataService.getData();   
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  languageArray: Language[] = [];
  @ViewChild('chipList', {static : false}) chipList;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  editBookForm: FormGroup;
  BindingType: any = ['Paperback', 'Case binding', 'Perfect binding', 'Saddle stitch binding', 'Spiral binding'];
  MatchType: any = ['Tournament', 'Scrim'];
  path: string;

  ngOnInit() {
    this.updateBookForm();
  }

  constructor(
    private dataService:DataService,
    private storage: AngularFireStorage,
    public fb: FormBuilder,    
    private location: Location,
    private bookApi: BookService,
    private router: Router,
    public dialogRef: MatDialogRef<'editDialog'>
  ) { 
    if(this.data){
      var id = this.data.$key;
      this.bookApi.GetBook(id).valueChanges().subscribe(data => {
        // this.languageArray = data.languages;
        this.editBookForm.setValue(data);
        this.selected = data.match_type;
        console.log(data);
      })
    }
  }

  /* Update form */
  updateBookForm(){
    this.editBookForm = this.fb.group({
      match_type: ['', [Validators.required]],
      match_title: ['', [Validators.required]],
      match_date: ['', [Validators.required]],
      rival_logo: [''],
      logo_id: ['']
      // book_name: ['', [Validators.required]],
      // isbn_10: ['', [Validators.required]],
      // author_name: ['', [Validators.required]],
      // publication_date: ['', [Validators.required]],
      // binding_type: ['', [Validators.required]],
      // in_stock: ['Yes'],
      // languages: ['']
    })
  }

  /* Add language */
  add(event: MatChipInputEvent): void {
    var input: any = event.input;
    var value: any = event.value;
    // Add language
    if ((value || '').trim() && this.languageArray.length < 5) {
      this.languageArray.push({name: value.trim()});
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove language */
  remove(language: any): void {
    const index = this.languageArray.indexOf(language);
    if (index >= 0) {
      this.languageArray.splice(index, 1);
    }
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.editBookForm.controls[controlName].hasError(errorName);
  }

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    // this.editBookForm.get('publication_date').setValue(convertDate, {
    //   onlyself: true
    // })
    this.editBookForm.get('match_date').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Go to previous page */
  goBack(){
    this.location.back();
  }

  /* Reset form */
  resetForm() {
    this.languageArray = [];
    this.editBookForm.reset();
    Object.keys(this.editBookForm.controls).forEach(key => {
      this.editBookForm.controls[key].setErrors(null)
    });
  }

  /* Submit book */
  updateBook() {
    console.log(this.selected)
    if (this.editBookForm.valid){
      if(window.confirm('Are you sure you wanna update?')){
        if(this.selected == 'Tournament'){
          console.log(this.editBookForm.value.logo_id)
          this.storage.ref(this.editBookForm.value.logo_id).delete();
          this.editBookForm.value.logo_id = '';
          this.editBookForm.value.rival_logo = '';
          console.log(this.editBookForm.value)
          this.dialogRef.close('test');
          this.bookApi.UpdateBook(this.editBookForm.value);
          this.router.navigate(['books-list']);
        }
        else {
          console.log('update scrim')
          this.dialogRef.close('test');
          this.bookApi.UpdateBook(this.editBookForm.value);
          this.router.navigate(['books-list']);
        }
      }
    }
  }

  startUpload(event: FileList) {
    console.log(event);
    console.log(this.selected);
    this.editBookForm.value.rival_logo = '';

    if(this.editBookForm.value.logo_id != ''){
      this.storage.ref(this.editBookForm.value.logo_id).delete();
    }
    // The File object
    const file = event.item(0)

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
    }

    const logo_id = `${new Date().getTime()}`
    this.editBookForm.value.logo_id = (this.editBookForm.value.logo_id != '') ? this.editBookForm.value.logo_id : logo_id;
    // The storage path
    this.path = (this.editBookForm.value.logo_id != '') ? this.editBookForm.value.logo_id : logo_id;
    // this.path = this.editBookForm.value.logo_id;
    const fileRef = this.storage.ref(this.path);
    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };
    // The main task
    this.task = this.storage.upload(this.path, file, { customMetadata })
    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges().pipe(
      // The file's download URL
      // finalize(() => this.downloadURL = fileRef.getDownloadURL()),
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.editBookForm.value.rival_logo = url;
          // this.fileService.insertImageDetails(this.id,this.url);
          alert('Upload Successful');
        })
      }),
      tap(snap => {
        // if (snap.bytesTransferred === snap.totalBytes) {
        //   // Update firestore on completion
        //   this.db.collection('photos').add( { path: this.path, size: snap.totalBytes })
        // }
      })
    )
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }
}