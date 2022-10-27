import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";
import { EmptyPaginatedResult, PaginatedResult } from "../models/paginated-result";
import { SearchParams } from "../models/search-params";
import { Team } from "../models/team";
import { Season } from "../models/season";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly _baseUrl: string;

  constructor(private _httpClient: HttpClient) {
    this._baseUrl = `${environment.nflServiceBaseUrl}/api/v1/search`;
  }

  public searchTeams(searchParams?: SearchParams): Observable<PaginatedResult<Team[]>>{
    let requestUrl = `${this._baseUrl}/teams`;

    if (searchParams?.sortColumn === "name") {
      searchParams.sortColumn = "TeamName";
    }

    let queryParams = searchParams?.toQueryParams();

    if (queryParams !== undefined && queryParams.length > 0) {
      let queryString = `?${queryParams.join('&').substring(0)}`;
      requestUrl = `${requestUrl}${queryString}`;
    }

    return this._httpClient.get<PaginatedResult<Team[]>>(requestUrl)
                            .pipe(
                              catchError(error => {
                                console.log(`HTTP error sending request, returning an empty response. Request Uri ${requestUrl}`, error);
                                return of(EmptyPaginatedResult);
                              }));
  }

  public searchSeasons(searchParams?: SearchParams): Observable<PaginatedResult<Season[]>> {
    let requestUrl = `${this._baseUrl}/seasons`;

    let queryParams = searchParams?.toQueryParams();

    if (queryParams !== undefined && queryParams.length > 0) {
      let queryString = `?${queryParams.join('&').substring(0)}`;
      requestUrl = `${requestUrl}${queryString}`;
    }

    return this._httpClient.get<PaginatedResult<Season[]>>(requestUrl)
                            .pipe(
                              catchError(error => {
                                console.log(`HTTP error sending request, returning an empty response. Request Uri ${requestUrl}`, error);
                                return of(EmptyPaginatedResult);
                              }));
  }
}
