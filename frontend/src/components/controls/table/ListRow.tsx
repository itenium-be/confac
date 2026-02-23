import {IListCell, IList} from './table-models';


type ListRowProps<TModel> = {
  config: IList<TModel>;
  model: TModel;
}


export const ListRow = <TModel,>({model, config}: ListRowProps<TModel>) => {
  // console.log('START LIST_ROW', config.rows.cells.map(c => c.key));
  return (
    <tr className={config.rows.className && config.rows.className(model)}>
      {config.rows.cells.map((col: IListCell<TModel>) => {
        const className = typeof col.className === 'function' ? col.className(model) : col.className;
        return (
          <td key={col.key} style={col.style} className={className}>
            {col.value(model)}
          </td>
        );
      })}
    </tr>
  );
};
