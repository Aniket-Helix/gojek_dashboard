import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Navigation } from 'app/core/navigation/navigation.types';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    currentActiveRoute: BehaviorSubject<any> = new BehaviorSubject<any>({});
    url = environment.api;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private cookieService: CookieService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<any>
    {
        let header = new HttpHeaders()
        header=header.set('Authorization',`Bearer ${this.cookieService.get('token')}`)
        return this._httpClient.get(this.url + `sections/getSectionsAndVariables`, {headers: header});
        // return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }

    setActiveRoute(routeDetails) {
        this.currentActiveRoute.next(routeDetails);
    }
}
