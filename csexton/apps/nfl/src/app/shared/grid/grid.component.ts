import { SelectionModel } from "@angular/cdk/collections";
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatRowDef, MatTableDataSource } from "@angular/material/table";
import { EmptyPaginatedResult, PaginatedResult } from "../../models/paginated-result";
import { SearchParams } from "../../models/search-params";
import { ColumnDef } from "./column-def";

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, AfterViewInit {
  isLoadingResults = true;
  totalDataCount: number = 0;
  columnKeys: string[] = [];
  defaultSort: any = { columnKey: "", direction: "" };
  datasource: MatTableDataSource<any[]>;
  selection = new SelectionModel<any>(false, []);

  @Input()
  data: PaginatedResult<any[]> = EmptyPaginatedResult;

  @Input()
  columnDefs: ColumnDef[] | undefined;

  @Output()
  onPageChangeEvent = new EventEmitter<SearchParams>();

  @Output()
  onTableRowSelectEvent = new EventEmitter<any>();

  @ViewChild(MatPaginator)
  paginator: MatPaginator | null = null;

  @ViewChild(MatSort)
  sort: MatSort | null = null;

  constructor() {
    this.datasource = new MatTableDataSource<any[]>();
  }

  ngOnInit(): void {
    if (this.columnDefs === undefined || this.columnDefs.length === 0) {
      throw Error("columnDefs input for the GridComponent is required.");
    }

    this.columnKeys = this.columnDefs.map(e => e.key);

    let defaultSortColumnDef = this.columnDefs.filter(e => e.isDefaultSort)[0];

    if (defaultSortColumnDef === undefined) {
        defaultSortColumnDef = this.columnDefs[0];
    }

    this.defaultSort = {
      columnKey: defaultSortColumnDef.key,
      direction: defaultSortColumnDef.defaultSortDirection
    } as const
  }

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanged = 'data' in changes;

    if (dataChanged) {
      this.data = changes['data'].currentValue;

      if (this.data.totalCount !== undefined) {
        this.totalDataCount = this.data.totalCount;
      }

      console.log("grid ngOnChanges");
      this.datasource = new MatTableDataSource<any[]>(this.data.results);

      this.isLoadingResults = false;
    }
  }

  onPageChange(page: PageEvent) {
    console.log("on page event");
    let searchParams = new SearchParams();
    searchParams.page = page.pageIndex;
    searchParams.pageSize = page.pageSize;
    searchParams.includeTotalCount = false;
    searchParams.sortColumn = this.sort?.active;
    searchParams.sortDirection = this.sort?.direction;

    this.isLoadingResults = true;
    this.onPageChangeEvent.emit(searchParams);
  }

  onTableRowClick(row: MatRowDef<any>) {
    this.selection.setSelection(row);
    this.onTableRowSelectEvent.emit(row);
  }

  onSortChange(sortState: Sort) {
    console.log("on sort event");
    let searchParams = new SearchParams();
    searchParams.page = 0;
    searchParams.pageSize = this.paginator?.pageSize;
    searchParams.includeTotalCount = false;
    searchParams.sortColumn = sortState.active;
    searchParams.sortDirection = sortState.direction;

    if (this.paginator !== null) {
      this.paginator.pageIndex = 0;
    }

    this.isLoadingResults = true;
    this.onPageChangeEvent.emit(searchParams);
  }
}
