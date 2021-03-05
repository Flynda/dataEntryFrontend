import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  filePathArray: string[] = []

  constructor(private fb: FormBuilder, private bkSvc: BackendService, private afstore: AngularFireStorage, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.dataEntryForm = this.fb.group({
      source_doc: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      image_urls: this.fb.array([])
    })
    this.afAuth.signInAnonymously()
  }

  get image_urls() {
    return this.dataEntryForm.get('image_urls') as FormArray
  }

  addImage_urls(image_url: string) {
    this.image_urls.push(this.fb.control(image_url))
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
    this.filePathArray.push(filePath)
    this.uploadPercent = task.percentageChanges()
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = ref.getDownloadURL()
        // console.log('ur',this.downloadURL)
        this.downloadURL.subscribe(singleURL => {
          console.dir(singleURL)
          this.addImage_urls(singleURL)
          console.log('images', this.image_urls.value)
        })
      })
    )
    .subscribe()
  }

  delete(i: number) {
    console.log('before deletion', this.filePathArray)
    console.log(this.image_urls.value)
    const ref = this.filePathArray.splice(i, 1)
    this.image_urls.removeAt(i)
    this.afstore.ref(ref[0]).delete().subscribe(() => console.log('delete successful'))
    console.log('after deletion', this.filePathArray)
    console.log(this.image_urls.value)
    
  }

  submit() {
    const formData: SampleForm = this.dataEntryForm.value as SampleForm
    console.log(formData)
    // this.bkSvc.postNewRecord(formData)
    //   .then(result => {
    //     console.info('return from backend: ', result)
    //     this.reset()
    //   })
    //   .catch(err => console.error(err))
  }

  reset() {
    this.dataEntryForm.reset()
  }

}
