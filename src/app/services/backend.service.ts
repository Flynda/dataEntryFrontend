import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SampleForm } from '../models/form';

@Injectable()
export class BackendService {

  private SERVER: string = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  postNewRecord (form: SampleForm) {
    return this.http.post(`${this.SERVER}/create`, form)
            .toPromise()
  }
}
