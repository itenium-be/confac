import {IList, IListCell} from '../table/table-models';
import {cellsToFooterCells} from '../table/ListFooter';


function createCell(footer?: string): IListCell<unknown> {
  return {header: '', key: footer || '', footer, value: _m => ''};
}


function createListModel(cells: IListCell<unknown>[]): IList<unknown> {
  const listModel: IList<unknown> = {
    rows: {
      cells,
    },
    data: [],
    sorter: (_a, _b) => 0,
  };
  return listModel;
}


describe('List Footer', () => {
  it('does not render anything if there is no footer', () => {
    const input = createListModel([createCell()]);
    const result = cellsToFooterCells(input);
    expect(result.length).toBe(0);
  });

  it('renders one cell with footer with colspan 1', () => {
    const input = createListModel([createCell('ah')]);
    const result = cellsToFooterCells(input);
    expect(result[0]).toBe(1);
  });

  it('renders one cell with footer with colspan 2', () => {
    const input = createListModel([createCell('ah'), createCell()]);
    const result = cellsToFooterCells(input);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(null);
  });

  it('renders one cell with footer with colspan 2 and extra cell', () => {
    const input = createListModel([createCell('ah'), createCell(), createCell('yup')]);
    const result = cellsToFooterCells(input);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(null);
    expect(result[2]).toBe(1);
  });

  it('full blown: like invoice', () => {
    const cells = [
      createCell('nr'),
      createCell(),
      createCell(),
      createCell(),
      createCell('invoice-days'),
      createCell('total-amount'),
      createCell(),
    ];

    const input = createListModel(cells);
    const result = cellsToFooterCells(input);

    expect(result.length).toBe(cells.length);
    expect(result[0]).toBe(4);
    expect(result[1]).toBeNull();
    expect(result[2]).toBeNull();
    expect(result[3]).toBeNull();
    expect(result[4]).toBe(1);
    expect(result[5]).toBe(2);
    expect(result[6]).toBeNull();
  });
});
