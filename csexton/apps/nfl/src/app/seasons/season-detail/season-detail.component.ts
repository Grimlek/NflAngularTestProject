import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: 'season-detail',
  templateUrl: './season-detail.component.html',
  styleUrls: ['./season-detail.component.scss'],
})
export class SeasonDetailComponent {
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute) {
    this.routeSub = this.route.params.subscribe(params => {
      console.log(params);
      console.log(params['seasonId']);
    });
  }
}
