import {useSelector} from 'react-redux';
import {ConfacState} from '../../../reducers/app-state';

type PaginationProps = {
  current: number;
  total: number;
  onChange: (page: number) => void;
  listSize?: number;
};


export const Pagination = (props: PaginationProps) => {
  const listSize = useSelector((state: ConfacState) => props.listSize ?? state.app.settings.listSize);
  const pageCount = Math.ceil(props.total / listSize);
  if (pageCount === 1) {
    return null;
  }

  if (pageCount > 10) {
    const start = Math.max(0, props.current - 3);
    const end = Math.min(pageCount, props.current + 4);
    return (
      <tfoot>
        <tr>
          <td colSpan={9}>
            <ul className="pagination">
              {props.current > 0 && (
                <>
                  <li onClick={() => props.onChange(0)} className="clickable">&lt;&lt;</li>
                  <li onClick={() => props.onChange(props.current - 1)} className="clickable">&lt;</li>
                </>
              )}

              {Array(end - start).fill(1).map((_, pageIndex) => {
                const humanIndex = pageIndex + start + 1;
                if (humanIndex - 1 === props.current) {
                  return <li key={humanIndex} className="active">{humanIndex}</li>;
                }

                return (
                  <li key={humanIndex} onClick={() => props.onChange(humanIndex - 1)} className="clickable">
                    {humanIndex}
                  </li>
                );
              })}

              {props.current < pageCount - 1 && (
                <>
                  <li onClick={() => props.onChange(props.current + 1)} className="clickable">&gt;</li>
                  <li onClick={() => props.onChange(pageCount - 1)} className="clickable">&gt;&gt;</li>
                </>
              )}
            </ul>
          </td>
        </tr>
      </tfoot>
    );
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
