import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";
import { SearchParams } from "../models/search-params";
import { Season } from "../models/season";

@Injectable({
  providedIn: 'root'
})
export class NflService {

  private readonly _baseUrl: string;

  constructor(private _httpClient: HttpClient) {
    this._baseUrl = `${environment.nflServiceBaseUrl}/api/v1/nfl`;
  }

  public getSeasons(searchParams?: SearchParams): Observable<Season[]> {
    let requestUrl = `${this._baseUrl}/seasons`;

    let queryParams = searchParams?.toQueryParams();

    if (queryParams !== undefined && queryParams.length > 0) {
      let queryString = `?${queryParams.join('&').substring(0)}`;
      requestUrl = `${requestUrl}${queryString}`;
    }

    return this._httpClient.get<Season[]>(requestUrl)
      .pipe(
        catchError(error => {
          console.log(`HTTP error sending request, returning an empty response. Request Uri ${requestUrl}`, error);
          return of([]);
        }));
  }

  public getDivisions(): Observable<string[]> {
    let requestUrl = `${this._baseUrl}/divisions`;

    return this._httpClient.get<string[]>(requestUrl)
      .pipe(
        catchError(error => {
          console.log(`HTTP error sending request, returning an empty response. Request Uri ${requestUrl}`, error);
          return of([]);
        }));
  }

  public getWeeks(): Observable<string[]> {
    let requestUrl = `${this._baseUrl}/weeks`;

    return this._httpClient.get<string[]>(requestUrl)
      .pipe(
        tap(response => response.sort(this._compareWeeks)),
        catchError(error => {
          console.log(`HTTP error sending request, returning an empty response. Request Uri ${requestUrl}`, error);
          return of([]);
        }));
  }

  // sort nfl weeks logically, 1-17 and also the playoffs/superbowl
  // compare function assumes no duplicate values
  private _compareWeeks(a: string, b: string): number {
      let aNumber = Number(a);
      let bNumber = Number(b);

      if (isNaN(aNumber) || isNaN(bNumber)) {
        if (isNaN(aNumber) && isNaN(bNumber) == false) {
          return 1;
        }

        if (isNaN(bNumber) && isNaN(aNumber) == false) {
          return -1;
        }

        let aLower = a.toLowerCase();
        let bLower = b.toLowerCase();

        if (aLower === "superbowl") {
          return 1;
        }
        else if (aLower === "conference"
                  && bLower !== "superbowl") {
          return 1;
        }
        else if (aLower === "division"
                  && bLower !== "superbowl"
                  && bLower !== "conference") {
          return 1
        }
        else if (aLower === "wildcard"
                  && bLower !== "superbowl"
                  && bLower !== "conference"
                  && bLower !== "division") {
          return 1;
        }

        return -1;
      }

      if (aNumber > bNumber) {
        return 1;
      }

      return -1;
  }
}
