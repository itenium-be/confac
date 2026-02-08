export interface OrderLine {
  Quantity?: number;
  UnitPriceExcl?: number;
  Unit?: string;
  Description?: string;
  DescriptionExtended?: string;
  Reference?: string;
  VATPercentage?: number;
  /** ExactOnline: kostendrager */
  AnalyticCostBearer?: string;
  /** ExactOnline: kostenplaats */
  AnalyticCostCenter?: string;
}
