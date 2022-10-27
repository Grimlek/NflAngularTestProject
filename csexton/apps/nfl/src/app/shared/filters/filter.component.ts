import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatSelectChange } from "@angular/material/select";
import { Filter } from "../../models/filter";
import { FilterChange } from "./filter-change";
import { FilterDef } from "./filter-def";

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent {
  @Input()
  filterDefs: FilterDef[] | undefined;

  @Output()
  onFilterChangeEvent = new EventEmitter<FilterChange>();

  selectedFilter: Filter | undefined;

  onSelectionChangeEvent(change: MatSelectChange, filterDefHeader: string) {
    let event = {
      newSelectedFilter: change.value,
      previousSelectedFilter: this.selectedFilter
    }

    this.onFilterChangeEvent.emit(event);

    this.selectedFilter = event.newSelectedFilter;
  }

  getDefaultFilter(filterDef: FilterDef) {
    return filterDef.filters?.find(e => e.value === "") ?? "";
  }
}
