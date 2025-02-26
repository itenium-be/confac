import {createInvoiceList, InvoiceFeatureBuilderConfig} from '../models/getInvoiceFeature';
import InvoiceListModel from '../models/InvoiceListModel';
import {List} from '../../controls/table/List';

export const NonGroupedInvoiceTable = ({vm, config}: {vm: InvoiceListModel, config: InvoiceFeatureBuilderConfig}) => {



  const feature = createInvoiceList(config);

  return <List feature={feature} />;
};
