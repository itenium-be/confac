/* eslint-disable react/jsx-one-expression-per-line */
import {ConsultantModel} from './ConsultantModel';
import {IList, IListCell, ConsultantListFilters} from '../../controls/table/table-models';
import {t, searchinize} from '../../utils';
import {Features, IFeature, IFeatureBuilderConfig} from '../../controls/feature/feature-models';
import {features} from '../../../trans';
import {EditIcon} from '../../controls/Icon';
import {DeleteIcon} from '../../controls/icons/DeleteIcon';
import {ConsultantLinkWithModal} from '../controls/ConsultantLinkWithModal';
import {Claim} from '../../users/models/UserModel';


export type ConsultantFeatureBuilderConfig = IFeatureBuilderConfig<ConsultantModel, ConsultantListFilters>;


const searchConsultantFor = (filters: ConsultantListFilters, model: ConsultantModel): boolean => {
  if (!filters.showInactive && !model.active) {
    return false;
  }

  if (!filters.freeText) {
    return true;
  }

  return searchinize(
    `${model.firstName} ${model.name} ${model.firstName} ${model.type} ${model.email} ${model.telephone}`,
  ).includes(searchinize(filters.freeText));
};



function getRowClassName(m: ConsultantModel): string | undefined {
  if (!m.active) {
    return 'table-danger';
  }
  return undefined;
}

const consultantListConfig = (config: ConsultantFeatureBuilderConfig): IList<ConsultantModel, ConsultantListFilters> => {
  const cells: IListCell<ConsultantModel>[] = [{
    key: 'name',
    value: m => <ConsultantLinkWithModal consultant={m} />,
    sort: (c, c1) => c.firstName.localeCompare(c1.firstName)
  }, {
    key: 'type',
    value: m => t(`consultant.types.${m.type}`),
    sort: (c, c1) => c.type.localeCompare(c1.type)
  }, {
    key: 'email',
    value: m => {
      if (m.email) {
        return <a href={`mailto:${m.email}`}>{m.email}</a>;
      }
      return '';
    },
    sort: (c, c1) => c.email.localeCompare(c1.email)
  }, {
    key: 'telephone',
    value: m => m.telephone,
  }, {
    key: 'accountingCode',
    value: m => m.accountingCode,
    sort: (c, c1) => c.accountingCode.localeCompare(c1.accountingCode)
  }, {
    key: 'buttons',
    header: {title: '', width: 110},
    value: m => (
      <>
        <EditIcon onClick={`/consultants/${m.slug || m._id}`} style={{marginRight: 15}} size={1} />
        <DeleteIcon
          claim={Claim.ManageConsultants}
          onClick={() => config.save({...m, active: !m.active})}
          title={m.active ? t('feature.deactivateTitle') : t('feature.activateTitle')}
          size={1}
        />
      </>
    ),
  }];

  return {
    rows: {
      className: getRowClassName,
      cells,
    },
    data: config.data,
    sorter: (a, b) => `${a.firstName} ${a.name}`.localeCompare(`${b.firstName} ${b.name}`),
  };
};



export const consultantFeature = (config: ConsultantFeatureBuilderConfig): IFeature<ConsultantModel, ConsultantListFilters> => {
  const feature: IFeature<ConsultantModel, ConsultantListFilters> = {
    key: Features.consultants,
    nav: m => `/consultants/${m === 'create' ? m : m.slug}`,
    trans: features.consultant as any,
    list: consultantListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: searchConsultantFor,
    softDelete: true,
  };

  return feature;
};
