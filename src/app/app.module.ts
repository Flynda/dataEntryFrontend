import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { DataEntryFormComponent } from './components/data-entry-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from './services/backend.service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DataEntryFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
