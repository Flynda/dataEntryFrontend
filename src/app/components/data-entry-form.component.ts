import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SampleForm } from '../models/form';
import { BackendService } from '../services/backend.service';
import { finalize } from 'rxjs/operators';
import firebase from 'firebase/app'

@Component({
  selector: 'app-data-entry-form',
  templateUrl: './data-entry-form.component.html',
  styleUrls: ['./data-entry-form.component.css']
})
export class DataEntryFormComponent implements OnInit {

  dataEntryForm: FormGroup
  uploadPercent: Observable<number>
  downloadURL: Observable<string>
  image_urls: string[] = []

  constructor(private fb: FormBuilder, private bkSvc: BackendService, private afstore: AngularFireStorage, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.dataEntryForm = this.fb.group({
      source_doc: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    })
    this.afAuth.signInAnonymously()
  }

  // login() {
  //   this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider)
    
  // }

  // logout() {
  //   this.afAuth.signOut();
  // }

  uploadFile(event) {
    const file = event.target.files[0]
    const filePath = '/test/' + file.name
    const ref = this.afstore.ref(filePath)
    const task = ref.put(file)
    this.uploadPercent = task.percentageChanges()
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = ref.getDownloadURL()
        console.log('ur',this.downloadURL)
        this.downloadURL.subscribe(some => {
          console.dir(some)
          this.image_urls.push(some)
        })
        // this.image_urls.push()
        console.log('images', this.image_urls)
      })
    )
    .subscribe()
  }

  submit() {
    const formData: SampleForm = this.dataEntryForm.value as SampleForm
    console.log(formData)
    this.bkSvc.postNewRecord(formData)
      .then(result => {
        console.info('return from backend: ', result)
        this.reset()
      })
      .catch(err => console.error(err))
  }

  reset() {
    this.dataEntryForm.reset()
  }

}
