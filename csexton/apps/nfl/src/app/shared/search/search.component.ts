import { KeyValue } from "@angular/common";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, Subscription } from "rxjs";

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly _userTypingDebounceTimeInMs: number = 500;

  private _searchValueChanged: Subject<undefined> = new Subject<undefined>();
  private _userTypingSubscription: Subscription | undefined;

  searchValue = '';

  @Output()
  onSearchEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this._userTypingSubscription = this._searchValueChanged
      .pipe(
        debounceTime(this._userTypingDebounceTimeInMs),
      )
      .subscribe(() => {
        this.onSearchEvent.emit(this.searchValue);
      });
  }

  onClearClickEvent() {
    this.searchValue = '';
    this.onKeyUpEvent();
  }

  onKeyUpEvent() {
    this._searchValueChanged.next(undefined);
  }

  ngOnDestroy(): void {
    this._userTypingSubscription?.unsubscribe();
  }
}
