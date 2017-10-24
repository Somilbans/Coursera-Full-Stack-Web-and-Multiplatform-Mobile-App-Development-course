import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RestangularModule, Restangular } from 'ngx-restangular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';

import { Leader } from '../shared/leader';


import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';


@Injectable()
export class LeaderService {

    constructor(private restangular: Restangular, private processHttpmsgService: ProcessHttpmsgService) { }

    getLeaders(): Observable<Leader[]> {
        return this.restangular.all('leaders').getList();
    }

    getLeader(id: number): Observable<Leader> {
        return this.restangular.one('leaders', id).get();
        }

    getFeaturedLeader(): Observable<Leader> {
        return this.restangular.all('leaders').getList({ featured: true }).map(leaders => leaders[0]);
        }   
 }