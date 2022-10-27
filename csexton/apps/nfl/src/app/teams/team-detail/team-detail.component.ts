import { Component, Input, SimpleChanges } from "@angular/core";
import { GameResult } from "../../enums/game-result";
import { Filter } from "../../models/filter";
import { Game } from "../../models/game";
import { SearchParams } from "../../models/search-params";
import { Season } from "../../models/season";
import { Team } from "../../models/team";
import { SearchService } from "../../services/search.service";

@Component({
  selector: 'team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent {

  @Input()
  team: Team | undefined = undefined;

  seasons: Season[] | undefined;

  seasonsDisplay: string | undefined;
  seasonRecordDisplay: string | undefined;
  playoffRecordDisplay: string | undefined;
  superbowlRecordDisplay: string | undefined;

  constructor(private readonly _searchService: SearchService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const teamIdChanged = 'team' in changes;

    if (teamIdChanged) {
      this.team = changes['team'].currentValue;

      let searchParams = new SearchParams();
      searchParams.page = 0;
      searchParams.pageSize = 1000;
      searchParams.sortColumn = "Year";
      searchParams.sortDirection = "desc";
      searchParams.includeTotalCount = true;
      searchParams.filters = [
        new Filter("", this.team?.id?.toString())
      ];

      this._searchService.searchSeasons(searchParams).subscribe(response => {
        this.seasons = response.results;

        let regularSeasonWins = 0;
        let regularSeasonLosses = 0;
        let regularSeasonTies = 0;

        let playoffWins = 0;
        let playoffLosses = 0;

        let superbowlWins = 0;
        let superbowlLosses = 0;

        for (let season of this.seasons) {
          for (let schedule of season.weeklySchedules) {
            for (let game of schedule.weeklyGames) {
              let gameInstance = Object.assign(new Game(), game);
              let gameResult = gameInstance.getGameResult(this.team!.id);

              // superbowls
              if (schedule.isPlayoffGame && schedule.week === "Superbowl") {
                if (gameResult === GameResult.Win) {
                  superbowlWins++;
                }
                else if (gameResult === GameResult.Loss) {
                  superbowlLosses++;
                }
              }
              // playoffs
              else if (schedule.isPlayoffGame) {
                if (gameResult === GameResult.Win) {
                  playoffWins++;
                }
                else if (gameResult === GameResult.Loss) {
                  playoffLosses++;
                }
              }
              // regular seasons
              else {
                if (gameResult === GameResult.Win) {
                  regularSeasonWins++;
                }
                else if (gameResult === GameResult.Loss) {
                  regularSeasonLosses++;
                }
                else if (gameResult === GameResult.Tie) {
                  regularSeasonTies++;
                }
              }
            }
          }
        }

        let years = this.seasons.map(e => e.year);

        this.seasonRecordDisplay = `Regular Season ${regularSeasonWins}-${regularSeasonLosses}-${regularSeasonTies}`;
        this.playoffRecordDisplay = `Playoff ${playoffWins}-${playoffLosses}`;
        this.superbowlRecordDisplay = `Superbowl ${superbowlWins}-${superbowlLosses}`;
        this.seasonsDisplay = `Seasons ${Math.min(...years)}-${Math.max(...years)}`;
      });
    }
  }
}
