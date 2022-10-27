import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { forkJoin, map, tap } from "rxjs";
import { DISPLAY_DATE_FORMAT } from "../app.constants";
import { ComparisonOperator } from "../enums/comparison-operator";
import { LogicalOperator } from "../enums/logical-operator";
import { Filter } from "../models/filter";
import { EmptyPaginatedResult, PaginatedResult } from "../models/paginated-result";
import { SearchParams } from "../models/search-params";
import { Season } from "../models/season";
import { NflService } from "../services/nfl.service";
import { SearchService } from "../services/search.service";
import { FilterChange } from "../shared/filters/filter-change";
import { FilterDef } from "../shared/filters/filter-def";
import { ColumnDef } from "../shared/grid/column-def";

/*

TODO

Season Detail
  Aggregate team win/lose records
  Highlight superbowl, division, wildcard and conference (make it easier to see if a team was a wildcard but won the superbowl)


How to handle pagination when searching, page size!

Modify grid to not emit search params but the value being emitted aka state interface.

*/
@Component({
  selector: 'seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SeasonsComponent implements OnInit {
  selectedSeasonId: number | undefined;
  seasons: Season[] | undefined;
  seasonSelectList: Season[] | undefined;

  filterDefs: FilterDef[] = [];
  selectedFilters: Filter[] = [];

  columnDefs: ColumnDef[] = [];
  paginatedRecords: PaginatedResult<any[]> = EmptyPaginatedResult;

  constructor(private readonly _searchService: SearchService, private readonly _nflService: NflService) {}

  ngOnInit(): void {
    this.columnDefs = [
      { key: "week", header: "Week", width: "150px", isDefaultSort: false, defaultSortDirection: undefined },
      { key: "homeTeamName", header: "Home Team Name", width: "250px", isDefaultSort: false, defaultSortDirection: undefined },
      { key: "homeTeamScore", header: "Home Team Score", width: "175px", isDefaultSort: false, defaultSortDirection: undefined },
      { key: "awayTeamName", header: "Away Team Name", width: "250px", isDefaultSort: false, defaultSortDirection: undefined },
      { key: "awayTeamScore", header: "Away Team Score", width: "175px", isDefaultSort: false, defaultSortDirection: undefined },
      { key: "gameDate", header: "Date", width: "100px", dataType: "date", format: DISPLAY_DATE_FORMAT, isDefaultSort: true, defaultSortDirection: 'desc' }
    ];

    this._nflService.getSeasons().subscribe(response => {
      this.seasonSelectList = response;
    });

    this._createFilters();
  }

  searchSeasons(searchParams: SearchParams): void {
    searchParams.filters = this.selectedFilters;

    this._searchService.searchSeasons(searchParams)
      .pipe(
        tap(data => console.log(data)),
        map(data => {
          let gridRecords : any[] = [];

          // todo improve, ugly but it works
          for (let season of data.results) {
            for (let schedule of season.weeklySchedules) {
              for (let game of schedule.weeklyGames) {
                let gridRecord = {
                  week: schedule.week,
                  homeTeamName: game.homeTeam.name,
                  awayTeamName: game.awayTeam.name,
                  homeTeamScore: game.homeTeamScore,
                  awayTeamScore: game.awayTeamScore,
                  gameDate: game.gameDate
                }

                gridRecords.push(gridRecord);
              }
            }
          }

          return {
            page: data.page,
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            results: gridRecords
          };
        }))
      .subscribe(response => {
        this.paginatedRecords = response;
      });
  }

  onSelectionChangeEvent() {
    this.selectedFilters = this.selectedFilters.filter(e => e.field !== "seasonId");

    this.selectedFilters.push(new Filter("seasonId", this.selectedSeasonId?.toString()));

    let searchParams = new SearchParams();
    searchParams.page = 0;
    searchParams.includeTotalCount = true;

    let defaultSortColumnDef = this.columnDefs.filter(e => e.isDefaultSort)[0];
    searchParams.sortColumn = defaultSortColumnDef.key;
    searchParams.sortDirection = defaultSortColumnDef.defaultSortDirection;
    searchParams.filters = this.selectedFilters;

    // TODO expose grid component as view child to grab page size and sorting
    // searchParams.pageSize = 25;
    // searchParams.sortColumn = this.sort?.active;
    // searchParams.sortDirection = this.sort?.direction;

    this.searchSeasons(searchParams);
  }

  onShowSeasonDetailComponent(season: Season | undefined) {
    // TODO
    // this.selectedSeason = season;
  }

  onFilterChangeEvent(filterChange: FilterChange) {
    let searchParams = new SearchParams();
    searchParams.page = 0;
    // TODO expose grid component as view child to grab page size
    // searchParams.pageSize = 25;
    searchParams.includeTotalCount = true;

    const defaultSortColumnDef = this.columnDefs.filter(e => e.isDefaultSort)[0];
    searchParams.sortColumn = defaultSortColumnDef.key;
    searchParams.sortDirection = defaultSortColumnDef.defaultSortDirection;

    this.selectedFilters = this.selectedFilters.filter(e => e.field !== filterChange.previousSelectedFilter?.field);

    if (filterChange.newSelectedFilter.value === undefined || filterChange.newSelectedFilter.value === '') {
      searchParams.filters = this.selectedFilters;
      this.searchSeasons(searchParams);
      return;
    }

    this.selectedFilters.push(filterChange.newSelectedFilter);

    searchParams.filters = this.selectedFilters;
    this.searchSeasons(searchParams);
  }

  private _createFilters() {
    let defaultFilterSearchParams = new SearchParams();
    defaultFilterSearchParams.page = 0;
    defaultFilterSearchParams.pageSize = 1000;

    let filters$ = [
      this._searchService.searchTeams(defaultFilterSearchParams)
        .pipe(
          map(response => response.results),
          map(teams => {
            return teams.map(e => {
              return new Filter("teamId", e.name, e.id.toString());
            });
          })),
      this._nflService.getWeeks()
        .pipe(
          map(weeks => {
            return weeks.map(week => {
              return new Filter("weeks", week, week);
            });
          })),
      this._nflService.getDivisions()
        .pipe(
          map(divisions => {
            return divisions.map(division => {
              return new Filter("divisions", division, division);
            });
          })),
    ];

    forkJoin(filters$)
      .subscribe(([teams, weeks, divisions]) => {
        const allFilter = new Filter("all", "", "All");

        let teamFilterDefs: FilterDef = { displayHeader: "Teams", filters: [] };
        teamFilterDefs.filters.push(allFilter);
        teamFilterDefs.filters.push(...teams);

        let weekFilterDefs: FilterDef = { displayHeader: "Weeks", filters: [] };
        weekFilterDefs.filters.push(allFilter);
        weekFilterDefs.filters.push(...weeks);

        let divisionFilterDefs: FilterDef = { displayHeader: "Divisions", filters: [] };
        divisionFilterDefs.filters.push(allFilter);
        divisionFilterDefs.filters.push(...divisions);

        let gameFilterDefs: FilterDef = {
          displayHeader: "Scores",
          filters: [
            allFilter,
            new Filter("scores", "40", "Scores Greater Than 40", LogicalOperator.And, ComparisonOperator.GreaterThan),
            new Filter("scores", "30", "Scores Greater Than 30", LogicalOperator.And, ComparisonOperator.GreaterThan),
            new Filter("scores", "10", "Scores Less Than 10",    LogicalOperator.And, ComparisonOperator.LessThan)
          ]
        };

        this.filterDefs.push(divisionFilterDefs);
        this.filterDefs.push(teamFilterDefs);
        this.filterDefs.push(weekFilterDefs);
        this.filterDefs.push(gameFilterDefs);
      });
  }
}
