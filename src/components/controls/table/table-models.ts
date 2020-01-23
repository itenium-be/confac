
export interface IList<TModel> {
  rows: IListRow<TModel>;
}



export interface IListRow<TModel> {
  className?: (m: TModel) => string;
  cells: IListCell<TModel>[];
}


export interface IListCell<TModel> {
  /** unique semantic made up key */
  key: string;
  /** Translation key */
  header: string | IListHeaderCell;
  /** Render the cell */
  value: (m: TModel) => string | React.ReactNode;
  /** Cell styles */
  style?: React.CSSProperties;
  /** Cell className */
  className?: string;
  /** Will span until next cell with a footer */
  footer?: string | ((models: TModel[]) => string | React.ReactNode);
}


export interface IListHeaderCell {
  /** Translation key */
  title: string;
  width?: string;
}
