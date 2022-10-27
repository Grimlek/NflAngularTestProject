import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NflService } from "./services/nfl.service";
import { SearchService } from './services/search.service';
import { TeamsComponent } from './teams/teams.component';
import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
import { SeasonsComponent } from './seasons/seasons.component';
import { SeasonDetailComponent } from './seasons/season-detail/season-detail.component';
import { FilterComponent } from './shared/filters/filter.component';
import { SearchComponent } from './shared/search/search.component';
import { GridComponent } from './shared/grid/grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { PipeModule } from './modules/pipe.module';
import { AppRoutingModule } from './modules/app-routing.module';
import { LayoutComponent } from './shared/layout/layout.component';


@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    FilterComponent,
    LayoutComponent,
    SearchComponent,
    SeasonsComponent,
    SeasonDetailComponent,
    TeamsComponent,
    TeamDetailComponent,
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MaterialModule,
        PipeModule,
        FormsModule,
    ],
  providers: [SearchService, NflService],
  bootstrap: [AppComponent],
})
export class AppModule {}
