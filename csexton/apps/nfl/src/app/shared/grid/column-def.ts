// TODO change to generic class or some other construct to handle defaults better
export interface ColumnDef {
  key: string;
  header: string;
  width: string | undefined;
  dataType?: string | undefined;
  format?: string | undefined;
  // TODO would validate default sort direction and/or column name based on the specified type
  isDefaultSort: boolean;
  // TODO change to a type
  defaultSortDirection: string | undefined;
}
