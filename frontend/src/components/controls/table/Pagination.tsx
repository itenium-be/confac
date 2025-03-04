import { useSelector } from 'react-redux';
import { ConfacState } from '../../../reducers/app-state';

type PaginationProps = {
  current: number;
  total: number;
  onChange: (page: number) => void;
  listSize? : number
};


export const Pagination = (props: PaginationProps) => {
  const listSize = useSelector((state: ConfacState) => props.listSize ?? state.app.settings.listSize);
  const pageCount = Math.ceil(props.total / listSize);
  if (pageCount === 1) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        <td colSpan={9}>
          <ul className="pagination">
            {Array(pageCount).fill(1).map((_, pageIndex) => {
              const humanIndex = pageIndex + 1;
              if (pageIndex === props.current) {
                return <li key={humanIndex}>{humanIndex}</li>;
              }

              return (
                <li key={humanIndex} onClick={() => props.onChange(pageIndex)} className="clickable">
                  {humanIndex}
                </li>
              );
            })}
          </ul>
        </td>
      </tr>
    </tfoot>
  );
};
