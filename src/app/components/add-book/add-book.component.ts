import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { BookService } from './../../shared/book.service';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";

export interface Language {
  name: string;
}

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  languageArray: Language[] = [];
  @ViewChild('chipList', {static: false}) chipList;
  @ViewChild('resetBookForm', {static: false}) myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  bookForm: FormGroup;
  BindingType: any = ['Paperback', 'Case binding', 'Perfect binding', 'Saddle stitch binding', 'Spiral binding'];
  MatchType: any = ['Tournament', 'Scrim'];

  ngOnInit() { 
    this.bookApi.GetBookList();
    this.submitBookForm();
  }

  constructor(
    public fb: FormBuilder,
    private bookApi: BookService,
    public dialogRef: MatDialogRef<'addDialog'>
  ) { }

  /* Remove dynamic languages */
  remove(language: Language): void {
    const index = this.languageArray.indexOf(language);
    if (index >= 0) {
      this.languageArray.splice(index, 1);
    }
  }

  /* Reactive book form */
  submitBookForm() {
    this.bookForm = this.fb.group({
      match_type: ['', [Validators.required]],
      match_title: ['', [Validators.required]],
      match_date: ['', [Validators.required]],
      rival_logo: ['', [Validators.required]],
      book_name: ['', [Validators.required]],
      isbn_10: ['', [Validators.required]],
      author_name: ['', [Validators.required]],
      publication_date: ['', [Validators.required]],
      binding_type: ['', [Validators.required]],
      in_stock: ['Yes'],
      languages: [this.languageArray]
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.bookForm.controls[controlName].hasError(errorName);
  }

  /* Add dynamic languages */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.languageArray.length < 5) {
      this.languageArray.push({ name: value.trim() })
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  
  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.bookForm.get('publication_date').setValue(convertDate, {
      onlyself: true
    })
    this.bookForm.get('match_date').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Reset form */
  resetForm() {
    this.languageArray = [];
    this.bookForm.reset();
    this.submitBookForm();
    Object.keys(this.bookForm.controls).forEach(key => {
      this.bookForm.controls[key].setErrors(null)
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /* Submit book */
  submitBook() {
    if (this.bookForm.valid) {
      console.log('form submitted');
      this.resetForm();
      this.dialogRef.close('test');
      this.bookApi.AddBook(this.bookForm.value);
    } else {
      this.validateAllFormFields(this.bookForm);
    }
  }
}