import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeasonsComponent } from '../seasons/seasons.component';;
import { SeasonDetailComponent } from '../seasons/season-detail/season-detail.component';
import { TeamsComponent } from '../teams/teams.component';
import { TeamDetailComponent } from '../teams/team-detail/team-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Nfl Records',
    component: TeamsComponent
  },
  {
    path: 'seasons',
    title: 'Nfl Seasons',
    component: SeasonsComponent,
    children: [
      {
        path: ':seasonId',
        component: SeasonDetailComponent,
      }
    ],
  },
  {
    path: 'teams',
    title: 'Nfl Teams',
    component: TeamsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
