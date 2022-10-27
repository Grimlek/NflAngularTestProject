import { Component, OnInit, Type } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Resolve, ResolveFn, Router } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public readonly defaultTitle = "Nfl Records";

  public readonly sideNavList: any[];

  pageTitle: string | Type<Resolve<string>> | ResolveFn<string> | undefined;
  pageRoutePath: string | undefined;

  constructor(
    private readonly _titleService: Title, private readonly route: ActivatedRoute, private readonly router: Router) {

    this.sideNavList = [
      {
        name: "Seasons",
        routePath: "/seasons",
        isDefault: false
      },
      {
        name: "Teams",
        routePath: "/teams",
        isDefault: true
      },
    ];
  }

  ngOnInit(): void {
    this.router.events.pipe(
        filter(event=> event instanceof NavigationEnd)
      )
      .subscribe(events => {
        this.pageTitle = this.route.snapshot.firstChild?.routeConfig?.title;
        this.pageRoutePath = this.route.snapshot.firstChild?.routeConfig?.path;
      })
  }
}
