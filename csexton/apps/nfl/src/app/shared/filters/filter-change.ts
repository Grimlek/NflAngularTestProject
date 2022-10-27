import { Filter } from "../../models/filter";

export interface FilterChange {
  newSelectedFilter: Filter;
  previousSelectedFilter: Filter | undefined;
}
