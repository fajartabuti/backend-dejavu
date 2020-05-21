import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { MatchService } from '../../shared/match.service';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
export interface Language {
  name: string;
}

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css']
})
export class AddMatchComponent implements OnInit {
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;
  public selected: any;
  public selectedRadio: any = 'CODM';
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  languageArray: Language[] = [];
  @ViewChild('chipList', {static: false}) chipList;
  @ViewChild('resetMatchForm', {static: false}) myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedBindingType: string;
  matchForm: FormGroup;
  MatchType: any = ['Tournament', 'Scrim'];
  DivisionType: any = ['CODM', 'ML', 'PUBGM', 'PES'];
  path: string;

  ngOnInit() { 
    this.matchApi.GetMatchList();
    this.submitMatchForm();
  }

  constructor(
    private storage: AngularFireStorage, 
    public fb: FormBuilder,
    private matchApi: MatchService,
    public dialogRef: MatDialogRef<'addDialog'>
  ) { }

  submitMatchForm() {
    this.matchForm = this.fb.group({
      match_type: ['', [Validators.required]],
      division: ['', [Validators.required]],
      match_title: ['', [Validators.required]],
      match_date: ['', [Validators.required]],
      // match_hour: ['', [Validators.required]],
      // match_min: ['', [Validators.required]],
      rival_logo: [''],
      logo_id: ['']
    })
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.matchForm.controls[controlName].hasError(errorName);
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
    this.matchForm.get('match_date').setValue(convertDate, {
      onlyself: true
    })
  }

  /* Reset form */
  resetForm() {
    this.matchForm.reset();
    this.submitMatchForm();
    Object.keys(this.matchForm.controls).forEach(key => {
      this.matchForm.controls[key].setErrors(null)
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

  submitMatch() {
    console.log(this.matchForm.value)
    this.matchForm.value.rival_logo = (this.selected == 'Scrim') ? this.downloadURL : '';
    this.matchForm.value.logo_id = (this.selected == 'Scrim') ? this.path : '';
    if (this.matchForm.valid) {
      console.log('form submitted');
      this.dialogRef.close('test');
      this.matchApi.AddMatch(this.matchForm.value);
      this.resetForm();
    } else {
      this.validateAllFormFields(this.matchForm);
    }
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0)

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
    }

    // The storage path
    this.path = `${new Date().getTime()}`;
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
          this.downloadURL = url;
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