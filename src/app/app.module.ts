import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AngularMaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddMatchComponent } from './components/add-match/add-match.component';
import { EditMatchComponent } from './components/edit-match/edit-match.component';
import { MatchListComponent } from './components/match-list/match-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { MatchService } from './shared/match.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FileSizePipe } from './file-size.pipe';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthenticationService } from './auth/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BasicAuthInterceptor } from './auth/basic-auth.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { fakeBackendProvider } from './auth/fake-backend';

@NgModule({
  declarations: [
    AppComponent,
    AddMatchComponent,
    EditMatchComponent,
    MatchListComponent,
    FileSizePipe,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialFileInputModule
  ],
  providers: [
    MatchService,
    AuthenticationService, 
    AuthGuard,
    fakeBackendProvider,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
