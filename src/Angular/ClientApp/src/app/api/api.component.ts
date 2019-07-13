import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {
  private numbers: any;
  private loading: boolean;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getValues();
  }

  public getValues() {
    this.loading = true;
    this.http.get(environment.NumbersApi_Endpoint)
      .subscribe(
        data => this.numbers = data,
        err => { this.loading = false; },
        () => { this.loading = false; }
      );
  }

  public add() {
    this.loading = true;
    this.http.post(environment.NumbersApi_Endpoint, Math.floor(Math.random() * 999) + 1)
      .subscribe(
        () => { this.getValues(); },
        err => { this.loading = false; },
        () => { this.loading = false; }
      );
  }

  public delete(id: number) {
    this.loading = true;
    this.http.post(environment.NumbersApi_Endpoint + '/delete', id)
      .subscribe(
        () => { this.getValues(); },
        err => { this.loading = false; },
        () => { this.loading = false; }
      );
  }
}
