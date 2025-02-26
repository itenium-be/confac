import {useSelector} from 'react-redux';
import {createInvoiceList, InvoiceFeatureBuilderConfig} from '../models/getInvoiceFeature';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceListModel from '../models/InvoiceListModel';
import {ConfacState} from '../../../reducers/app-state';
import {List} from '../../controls/table/List';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInvoice, updateAppFilters } from '../../../actions';
import { Features } from '../../controls/feature/feature-models';

export const NonGroupedInvoiceTable = ({vm, config}: {vm: InvoiceListModel, config: InvoiceFeatureBuilderConfig}) => {



  const feature = createInvoiceList(config);

  return <List feature={feature} />;
};
