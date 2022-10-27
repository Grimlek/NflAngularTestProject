import { Game } from "./game";

export interface Schedule {
  id: number;
  isPlayoffGame: boolean;
  week: string;
  weeklyGames: Game[];
}
