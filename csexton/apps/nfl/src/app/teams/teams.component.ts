import { Component, OnInit } from '@angular/core';
import { EmptyPaginatedResult, PaginatedResult } from "../models/paginated-result";
import { SearchParams } from "../models/search-params";
import { Team } from "../models/team";
import { MaterialModule } from '../modules/material.module';
import { SearchService } from "../services/search.service";
import { ColumnDef } from "../shared/grid/column-def";

@Component({
  selector: 'teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  providers: [ MaterialModule, SearchService ]
})
export class TeamsComponent implements OnInit {

  columnDefs: ColumnDef[] = [];
  paginatedTeams: PaginatedResult<Team[]> = EmptyPaginatedResult;
  selectedTeam: Team | undefined = undefined;

  constructor(private readonly _searchService: SearchService) {}

  ngOnInit(): void {
    this.columnDefs = [
      { key: "name", header: "Name", width: "250px", isDefaultSort: true, defaultSortDirection: 'asc' },
      { key: "shortName", header: "Short Name", width: "150px", isDefaultSort: false, defaultSortDirection: undefined },
      { key: "abbreviation", header: "Abbreviation", width: "125px", isDefaultSort: false, defaultSortDirection: undefined },
      { key: "division", header: "Division", width: "125px", isDefaultSort: false, defaultSortDirection: undefined },
      { key: "conference", header: "Conference", width: "100px", isDefaultSort: false, defaultSortDirection: undefined }
    ];

    let defaultSearchParams = new SearchParams();
    defaultSearchParams.includeTotalCount = true;

    this.searchTeams(defaultSearchParams);
  }

  searchTeams(searchParams: SearchParams): void {
    this._searchService.searchTeams(searchParams).subscribe(response => {
      this.paginatedTeams = response;
    });
  }

  onSearchEvent(searchValue: string): void {
    let defaultSearchParams = new SearchParams();
    defaultSearchParams.includeTotalCount = true;
    defaultSearchParams.searchText = searchValue;

    this._searchService.searchTeams(defaultSearchParams).subscribe(response => {
      this.paginatedTeams = response;
    });
  }

  onShowTeamDetailComponent(team: Team | undefined) {
    this.selectedTeam = team;
  }
}
