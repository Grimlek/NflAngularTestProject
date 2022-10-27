import { GameResult } from "../enums/game-result";
import { Stadium } from "./stadium";
import { Team } from "./team";

export class Game {
  gameId!: number;
  gameDate!: Date;
  homeTeamScore: number | undefined;
  awayTeamScore: number | undefined;
  wasStadiumNeutral: boolean | undefined;
  awayTeam!: Team;
  homeTeam!: Team;
  stadium!: Stadium;

  getGameResult(teamId: number): GameResult {
    if (this.homeTeamScore === undefined || this.awayTeamScore === undefined) {
      return GameResult.NotPlayed;
    }

    if (this._isGameATie()) {
      return GameResult.Tie;
    }

    var didHomeTeamWin = this._didHomeTeamWin();

    if (didHomeTeamWin && this.homeTeam.id === teamId) {
      return GameResult.Win;
    }
    else if (didHomeTeamWin == false && this.awayTeam.id === teamId) {
      return GameResult.Win;
    }
    else {
      return GameResult.Loss;
    }
  }

  private _isGameATie(): boolean {
    return this.homeTeamScore === this.awayTeamScore
              && this.homeTeamScore !== undefined;
  }

  private _didHomeTeamWin(): boolean {
    return this.homeTeamScore !== undefined
            && this.awayTeamScore !== undefined
            && this.homeTeamScore > this.awayTeamScore;
  }
}
