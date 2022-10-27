import { ComparisonOperator } from "../enums/comparison-operator";
import { LogicalOperator } from "../enums/logical-operator";

export class Filter {
  constructor(
    public readonly field: string,
    public readonly value: string | undefined,
    public readonly displayText: string | undefined = undefined,
    public readonly logicalOperator: LogicalOperator = LogicalOperator.And,
    public readonly comparisonOperator: ComparisonOperator | undefined = undefined
  ) { }

  toQueryParams(index: number): string[] {
    let queryParams: string[] = [];

    let filterPrefix = `filters[${index}].`;

    queryParams.push(`${filterPrefix}field=${this.field}`);
    queryParams.push(`${filterPrefix}value=${this.value}`);

    if (this.logicalOperator !== undefined) {
      queryParams.push(`${filterPrefix}logicalOperator=${this.logicalOperator}`);
    }

    if (this.comparisonOperator !== undefined) {
      queryParams.push(`${filterPrefix}comparisonOperator=${this.comparisonOperator}`);
    }

    return queryParams;
  }
}
