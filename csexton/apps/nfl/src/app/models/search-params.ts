import { Filter } from "./filter";

export class SearchParams {
  page: number | undefined;
  pageSize: number | undefined;
  includeTotalCount: boolean | undefined = undefined;

  searchText: string | undefined = undefined;

  sortColumn: string | undefined = undefined;
  sortDirection: string | undefined = undefined;

  filters: Filter[] | undefined = undefined;

  selectFields: string[] | undefined = undefined;

  toQueryParams(): string[] {
    let queryParams: string[] = [];

    if (this.searchText) {
      queryParams.push(`searchText=${this.searchText}`);
    }

    if (this.sortColumn !== undefined && this.sortDirection !== undefined) {
      queryParams.push(`sort.column=${this.sortColumn}`);
      queryParams.push(`sort.direction=${this.sortDirection}`);
    }

    queryParams.push(`pagination.page=${this.page ?? "0"}`);
    queryParams.push(`pagination.pageSize=${this.pageSize ?? "25"}`);

    if (this.includeTotalCount) {
      queryParams.push(`pagination.includeTotalCount=${this.includeTotalCount}`);
    }

    if (this.selectFields !== undefined) {
      for (let i = 0; i < this.selectFields.length; i++) {
        let fieldValue = this.selectFields[i];
        let fieldKey = `selectFields[${i}]`;

        queryParams.push(`${fieldKey}=${fieldValue}`);
      }
    }

    if (this.filters !== undefined) {
      for (let i = 0; i < this.filters.length; i++) {
        queryParams.push(...this.filters[i].toQueryParams(i));
      }
    }

    return queryParams;
  }
}
