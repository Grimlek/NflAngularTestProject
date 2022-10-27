export interface PaginatedResult<T> {
  results: T;
  pageSize: number;
  page: number;
  totalCount: number | undefined;
}


export const EmptyPaginatedResult = {
  page: 0,
  pageSize: 0,
  totalCount: 0,
  results: []
}
