
/**
 * TODO: TModel has an untyped dependency on an _id property
 *
 * A simple table with filters and action buttons
 */
export interface IList<TModel, TFilterModel extends ListFilters = {}, TTag = {}> {
  /** Defaults to featureTrans.key.listTitle */
  listTitle?: () => string;
  /** Config for rows and cells */
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



export type ListFilters = {
  freeText?: string;
  showInactive?: boolean;
}

export type ProjectListFilters = ListFilters;
export type ProjectMonthListFilters = ListFilters & {
  /** Format: {YYYY-MM: true} */
  openMonths: {[key: string]: boolean},
  unverifiedOnly: boolean
};
export type InvoiceListFilters = ListFilters;
export type ConsultantListFilters = ListFilters;
export type UsersListFilters = ListFilters;
export type RolesListFilters = ListFilters;

export type ClientListFilters = ListFilters & {
  years: number[];
};


export interface IListFilter<TFilterModel extends ListFilters, TModel> {
  state: TFilterModel,
  updateFilter: (m: TFilterModel) => void,
  fullTextSearch?: (filters: TFilterModel, m: TModel) => boolean;
  softDelete?: boolean;
  /** Custom filter components */
  extras?: () => React.ReactNode;
}

type StringFn<TModel> = (m: TModel) => string | undefined;


/**
 * A row in a list
 * */
export interface IListRow<TModel> {
  /** Return a className for the <tr> element */
  className?: StringFn<TModel>;
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
  header?: string | IListHeaderCell | false;
  /** Render the cell */
  value: (m: TModel) => string | React.ReactNode;
  /** Cell styles */
  style?: React.CSSProperties;
  /** Cell className */
  className?: string | StringFn<TModel>;
  // BUG: GroupedInvoiceTable footer is wrong
  /** Will span until next cell with a footer */
  footer?: string | ((models: TModel[]) => string | React.ReactNode);

  sort?: (asc: boolean) => (a: TModel, b: TModel) => number
}



/**
 * Part of IListCell containing <th> configuration
 */
export interface IListHeaderCell {
  /** Translation key */
  title: string;
  /** The column width */
  width?: string | number;
}
