import React from 'react';
import {Table} from 'react-bootstrap';
import {ListHeader} from './ListHeader';
import {ListRow} from './ListRow';
import {ListFooter} from './ListFooter';
import {IFeature} from '../feature/feature-models';

type ListProps = {
  feature: IFeature<any, any>;
}


export const List = ({feature}: ListProps) => {
  const config = feature.list;

  let {data} = config;
  if (feature.list.sorter) {
    data = data.slice().sort(feature.list.sorter);
  }

  if (feature.list.filter) {
    const {filter} = feature.list;
    if (filter.fullTextSearch) {
      data = data.filter(model => filter.fullTextSearch(feature.list.filter, model));
    }
  }

  console.log('data', data.map(d => d._id));

  return (
    <Table size="sm">
      <ListHeader feature={feature} />
      <tbody>
        {data.map(model => (
          <ListRow config={config} model={model} key={model._id} />
        ))}
      </tbody>
      <ListFooter config={config} />
    </Table>
  );
};
