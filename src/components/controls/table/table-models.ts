// {columns.map((col, i) => <th key={i}>{col.header}</th>)}


// export interface IList {
//   className: ()
//   //cells: IListCell;

// }


export interface IListCell {
  /** unique semantic made up key */
  key: string;
  /** Translation key */
  header: string | IListHeaderCell;
  /** Render the cell */
  value: (i: any) => string | React.ReactNode;
  /** Cell styles */
  style?: React.CSSProperties;
  /** Cell className */
  className?: string;
}


export interface IListHeaderCell {
  /** Translation key */
  title: string;
  width?: string;
}
