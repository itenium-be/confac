
/**
 * TODO: TModel has an untyped dependency on an _id property
 *
 * A simple table with filters and action buttons
 */
export interface IList<TModel, TFilterModel = {}, TTag = {}> {
  /** How  */
  rows: IListRow<TModel>;
  /** The actual data */
  data: TModel[];
  /** Sort the list */
  sorter: (a: TModel, b: TModel) => number;
  /** Any custom data */
  tag?: TTag;
  /** Filter the list */
  filter?: IListFilter<TFilterModel, TModel>;
}


export interface IListFilter<TFilterModel, TModel> {
  updateFilter?: Function,
  fullTextSearch: (filters: TFilterModel, m: TModel) => boolean;
  softDelete?: boolean;

}

/**
 * A row in a list
 * */
export interface IListRow<TModel> {
  /** Return a className for the <tr> element */
  className?: (m: TModel) => string | undefined;
  /** The different columns the row exists of */
  cells: IListCell<TModel>[];
}

/**
 * A single <td> cell inside a IListRow
 * Also provides header/footers for the cell
 */
export interface IListCell<TModel> {
  /** unique semantic made up key */
  key: string;
  /**
   * Translation key
   * Use empty string to not render a header label
   * If omitted, will default to trans.props[key];
   * */
  header?: string | IListHeaderCell;
  /** Render the cell */
  value: (m: TModel) => string | React.ReactNode;
  /** Cell styles */
  style?: React.CSSProperties;
  /** Cell className */
  className?: string;
  // BUG: GroupedInvoiceTable footer is wrong
  /** Will span until next cell with a footer */
  footer?: string | ((models: TModel[]) => string | React.ReactNode);
}

/**
 * Part of IListCell containing <th> configuration
 */
export interface IListHeaderCell {
  /** Translation key */
  title: string;
  /** The column width */
  width?: string;
}
