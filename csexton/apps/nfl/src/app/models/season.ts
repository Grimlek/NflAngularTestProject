import { Schedule } from "./schedule";

export interface Season {
  id: number;
  year: number;
  weeklySchedules: Schedule[];
}
