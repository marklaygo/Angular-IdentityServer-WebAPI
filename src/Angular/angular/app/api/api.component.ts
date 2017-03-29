import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { AuthHttp } from 'angular2-jwt';
import { environment } from 'environment';

@Component({
    selector: 'api',
    templateUrl: './api.component.html',
    styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {
    private numbers: any;
    private loading: boolean;

    constructor(private authHttp: AuthHttp, private http: Http) { }        

    ngOnInit(): void {
        this.getValues();
    }

    public getValues() {
        this.loading = true;
        this.authHttp.get(environment.NumbersApi_Endpoint)
            .subscribe(
                data => this.numbers = data.json(),
                err => { this.loading = false; },
                () => { this.loading = false; }
            );
    }

    public add() {
        this.loading = true;
        this.authHttp.post(environment.NumbersApi_Endpoint, JSON.stringify(Math.floor(Math.random() * 999) + 1))
            .subscribe(
                () => { this.getValues(); },
                err => { this.loading = false; },
                () => { this.loading = false; }
            );
    }

    public delete(id: number) {
        this.loading = true;
        this.authHttp.post(environment.NumbersApi_Endpoint + '/delete', JSON.stringify(id))
            .subscribe(
                () => { this.getValues(); },
                err => { this.loading = false; },
                () => { this.loading = false; }
            );
    }
}
