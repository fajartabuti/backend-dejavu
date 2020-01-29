import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialogRef } from '@angular/material';
import { MatchService } from '../../shared/match.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataService } from '../../shared/data.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export interface Language {
  name: string;
}

@Component({
  selector: 'app-edit-match',
  templateUrl: './edit-match.component.html',
  styleUrls: ['./edit-match.component.css']
})

export class EditMatchComponent implements OnInit {
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
  editMatchForm: FormGroup;
  MatchType: any = ['Tournament', 'Scrim'];
  path: string;

  ngOnInit() {
    this.updateMatchForm();
  }

  constructor(
    private dataService:DataService,
    private storage: AngularFireStorage,
    public fb: FormBuilder,    
    private location: Location,
    private matchApi: MatchService,
    private router: Router,
    public dialogRef: MatDialogRef<'editDialog'>
  ) { 
    if(this.data){
      var id = this.data.$key;
      this.matchApi.GetMatch(id).valueChanges().subscribe(data => {
        // this.languageArray = data.languages;
        this.editMatchForm.setValue(data);
        this.selected = data.match_type;
      })
    }
  }

  updateMatchForm(){
    this.editMatchForm = this.fb.group({
      match_type: ['', [Validators.required]],
      match_title: ['', [Validators.required]],
      match_date: ['', [Validators.required]],
      rival_logo: [''],
      logo_id: ['']
    })
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.editMatchForm.controls[controlName].hasError(errorName);
  }

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    
    this.editMatchForm.get('match_date').setValue(convertDate, {
      onlyself: true
    })
  }

  resetForm() {
    this.editMatchForm.reset();
    Object.keys(this.editMatchForm.controls).forEach(key => {
      this.editMatchForm.controls[key].setErrors(null)
    });
  }

  updateMatch() {
    console.log(this.selected)
    if (this.editMatchForm.valid){
      if(window.confirm('Are you sure you wanna update?')){
        if(this.selected == 'Tournament'){
          console.log(this.editMatchForm.value.logo_id)
          if(this.editMatchForm.value.logo_id != ''){
            this.storage.ref(this.editMatchForm.value.logo_id).delete();
          }
          this.editMatchForm.value.logo_id = '';
          this.editMatchForm.value.rival_logo = '';
          console.log(this.editMatchForm.value)
          this.dialogRef.close('test');
          this.matchApi.UpdateMatch(this.editMatchForm.value);
          this.router.navigate(['matches-list']);
        }
        else {
          console.log('update scrim')
          this.dialogRef.close('test');
          this.matchApi.UpdateMatch(this.editMatchForm.value);
          this.router.navigate(['matches-list']);
        }
      }
    }
  }

  startUpload(event: FileList) {
    this.editMatchForm.value.rival_logo = '';

    if(this.editMatchForm.value.logo_id != ''){
      this.storage.ref(this.editMatchForm.value.logo_id).delete();
    }
    // The File object
    const file = event.item(0)

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
    }

    const logo_id = `${new Date().getTime()}`
    this.editMatchForm.value.logo_id = (this.editMatchForm.value.logo_id != '') ? this.editMatchForm.value.logo_id : logo_id;
    // The storage path
    this.path = (this.editMatchForm.value.logo_id != '') ? this.editMatchForm.value.logo_id : logo_id;
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
          this.editMatchForm.value.rival_logo = url;
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