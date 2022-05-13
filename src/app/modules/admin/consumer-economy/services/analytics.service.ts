import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    url = environment.api;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private cookieService: CookieService) { }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(varId: number): Observable<any> {
        let header = new HttpHeaders()
        header=header.set('Authorization',`Bearer ${this.cookieService.get('token')}`)
        return this._httpClient.get(this.url + 'reports/getAllData', {headers: header, params: {varId}}).pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    /**
     * 
     * @param varId 
     * @returns Variable Notes
     */
    getVariableNotes(varId: number): Observable<any> {
        let header = new HttpHeaders()
        header=header.set('Authorization',`Bearer ${this.cookieService.get('token')}`)
       return this._httpClient.get(this.url + 'sections/getVariableNotes', {headers: header, params: {varId}});
    }

    getFilteredData(filterJson: Object, varId: number): Observable<any> {
        var header = {
            headers: new HttpHeaders().set('Authorization',  `Bearer ${this.cookieService.get('token')}`),
            params: { varId }
        }
        return this._httpClient.post(this.url + 'reports/getFilteredData', filterJson , header)
    }

    addUserToMailingList(userData: Object): Observable<any> {
        var header = {
            headers: new HttpHeaders().set('Authorization',  `Bearer ${this.cookieService.get('token')}`),
        }
        return this._httpClient.post(this.url + 'mailchimp/addMemberToList', userData, header)
    }

    signup(email: String): Observable<any>{
        return this._httpClient.post(this.url + 'auth/signup', {email: email})
    }
}
