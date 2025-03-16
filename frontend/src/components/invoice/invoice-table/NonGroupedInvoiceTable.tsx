import {createInvoiceList, InvoiceFeatureBuilderConfig} from '../models/getInvoiceFeature';
import {List} from '../../controls/table/List';

import './invoice-list.scss';

export const NonGroupedInvoiceTable = ({config}: {config: InvoiceFeatureBuilderConfig}) => {
  const featureConfig = createInvoiceList(config);

  return <List feature={featureConfig} />;
};
