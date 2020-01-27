import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { BookService } from './../../shared/book.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService } from '../../shared/data.service';

export interface Language {
  name: string;
}

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})

export class EditBookComponent implements OnInit {
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

  ngOnInit() {
    this.updateBookForm();
  }

  constructor(
    private dataService:DataService,
    public fb: FormBuilder,    
    private location: Location,
    private bookApi: BookService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<'editDialog'>
  ) { 
    if(this.data){
      var id = this.data.$key;
      this.bookApi.GetBook(id).valueChanges().subscribe(data => {
        this.languageArray = data.languages;
        this.editBookForm.setValue(data);
      })
    }
  }

  /* Update form */
  updateBookForm(){
    this.editBookForm = this.fb.group({
      book_name: ['', [Validators.required]],
      isbn_10: ['', [Validators.required]],
      author_name: ['', [Validators.required]],
      publication_date: ['', [Validators.required]],
      binding_type: ['', [Validators.required]],
      in_stock: ['Yes'],
      languages: ['']
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
    this.editBookForm.get('publication_date').setValue(convertDate, {
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
    var id = this.actRoute.snapshot.paramMap.get('id');
    if (this.editBookForm.valid){
      if(window.confirm('Are you sure you wanna update?')){
        this.dialogRef.close('test');
        this.bookApi.UpdateBook(id, this.editBookForm.value);
        this.router.navigate(['books-list']);
      }
    }
  }
}