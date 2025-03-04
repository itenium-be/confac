import {createInvoiceList, InvoiceFeatureBuilderConfig} from '../models/getInvoiceFeature';
import {List} from '../../controls/table/List';

export const NonGroupedInvoiceTable = ({config}: {config: InvoiceFeatureBuilderConfig}) => {
  const featureConfig = createInvoiceList(config);

  return <List feature={featureConfig} />;
};
