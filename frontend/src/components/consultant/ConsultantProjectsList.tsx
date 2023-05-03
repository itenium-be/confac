import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {ConfacState} from '../../reducers/app-state';
import {ListPage} from '../controls/table/ListPage';
import {saveConsultant} from '../../actions/consultantActions';
import {updateAppFilters} from '../../actions';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {Features, IFeature, IFeatureBuilderConfig} from '../controls/feature/feature-models';
import {ConsultantModel} from './models/ConsultantModel';
import {IProjectModel} from '../project/models/IProjectModel';
import {formatDate, searchinize, t} from '../utils';
import {IList, IListCell, ListFilters} from '../controls/table/table-models';
import {ClientModel} from '../client/models/ClientModels';
import { ConsultantLinkWithModal } from "./controls/ConsultantLinkWithModal";
import {ConsultantCountFooter} from '../project/project-month-list/table/footers/ConsultantCountFooter';
import {InvoiceClientCell} from '../invoice/invoice-table/InvoiceClientCell';
import {ProjectClientTariff} from '../project/models/getProjectFeature';
import {features} from '../../trans';
import {Ellipsis} from '../controls/Tooltip';
import {ToClipboardLabel} from '../controls/other/ToClipboardLabel';
import {ContractIcons} from '../client/contract/ContractIcons';
import {EditIcon} from '../controls/Icon';
import {DeleteIcon} from '../controls/icons/DeleteIcon';
import {Claim} from '../users/models/UserModel';


type ConsultantProject = {
  consultant: ConsultantModel,
  project?: IProjectModel,
  client?: ClientModel,
}


function useConsultantProjects(): ConsultantProject[] {
  const now = moment().startOf('day');
  const {projects, clients, consultants} = useSelector((state: ConfacState) => ({
    projects: state.projects.filter(x => moment(x.startDate) <= now && (!x.endDate || moment(x.endDate) >= now)),
    clients: state.clients,
    consultants: state.consultants.filter(x => x.active).filter(x => x.type === 'consultant')
  }));

  const result = consultants.reduce((acc, consultant) => {
    const consultantProjects = projects.filter(x => x.consultantId === consultant._id)

    if (consultantProjects.length) {
      acc = acc.concat(consultantProjects.map(project => ({
        consultant,
        project,
        client: clients.find(client => client._id === project.client.clientId)
      })));

    } else {
      acc.push({consultant});
    }

    return acc;
  }, [] as ConsultantProject[]);

  return result;
}

function getRowClassName(m: ConsultantProject): string | undefined {
  if (!m.project) {
    return 'table-danger';
  }
  return undefined;
}



type ConsultantFeatureBuilderConfig = IFeatureBuilderConfig<ConsultantProject, ListFilters>;


const searchConsultantFor = (filters: ListFilters, model: ConsultantProject): boolean => {
  if (!filters.freeText) {
    return true;
  }

  return searchinize(
    `${model.consultant.name} ${model.consultant.firstName} ${model.consultant.name}
     ${model.consultant.email} ${model.client?.name}`,
  ).includes(searchinize(filters.freeText));
};


const consultantListConfig = (config: ConsultantFeatureBuilderConfig): IList<ConsultantProject, ListFilters> => {
  const list: IListCell<ConsultantProject>[] = [{
    key: 'consultant',
    header: 'project.consultant',
    value: p => <ConsultantLinkWithModal consultant={p.consultant} showType />,
    footer: (models: ConsultantProject[]) => <ConsultantCountFooter consultants={models.map(x => x.consultant)} />,
  }, {
    key: 'startDate',
    header: 'project.startDate',
    value: p => formatDate(p.project?.startDate),
  }, {
    key: 'endDate',
    header: 'project.endDate',
    value: p => p.project?.endDate && formatDate(p.project?.endDate),
  }, {
    key: 'client',
    header: 'project.client.clientId',
    value: p => <InvoiceClientCell client={p.client} />,
  }, {
    key: 'clientTariff',
    header: 'project.client.tariff',
    value: p => <ProjectClientTariff projectClient={p.project?.client} />,
  }, {
    key: 'clientRef',
    header: 'project.client.ref',
    value: p => p.project?.client.ref && (
      <Ellipsis title={p.project?.client.ref} width={100}>
        <ToClipboardLabel label={p.project?.client.ref} />
      </Ellipsis>
    ),
  }, {
    key: 'contract',
    header: 'project.contract.contracts',
    value: p => <ContractIcons project={p.project} client={p.client} />,
  }, {
    key: 'buttons',
    header: {title: '', width: 110},
    value: m => (
      <>
        {m.project?._id && <EditIcon onClick={`/projects/${m.project?._id}`} style={{marginRight: 15}} size={1} />}
        {!m.project?._id && (
          <DeleteIcon
            claim={Claim.ManageConsultants}
            onClick={() => config.save({...m.consultant, active: !m.consultant.active} as any)}
            title={m.consultant.active ? t('feature.deactivateTitle') : t('feature.activateTitle')}
            size={1}
          />
        )}
      </>
    ),
  }];

  return {
    rows: {
      className: getRowClassName,
      cells: list,
    },
    data: config.data,
    // sorter: (a, b) => `${a.consultant.firstName} ${a.consultant.name}`.localeCompare(`${b.consultant.firstName} ${b.consultant.name}`),
    sorter: (a, b) => `${a.project?.endDate}`.localeCompare(`${b.project?.endDate}`),
  };
};




const consultantFeature = (config: ConsultantFeatureBuilderConfig): IFeature<ConsultantProject, ListFilters> => {
  const feature: IFeature<ConsultantProject, ListFilters> = {
    key: Features.consultants,
    nav: m => `/consultants/create`,
    trans: features.consultant as any,
    list: consultantListConfig(config),
  };

  feature.list.filter = {
    state: config.filters,
    updateFilter: config.setFilters,
    fullTextSearch: searchConsultantFor,
    softDelete: false,
  };

  return feature;
};



export const ConsultantProjectsList = () => {
  useDocumentTitle('consultantList');

  const dispatch = useDispatch();
  const models = useConsultantProjects();
  const filters = useSelector((state: ConfacState) => state.app.filters.consultants);

  const config: ConsultantFeatureBuilderConfig = {
    data: models,
    save: m => dispatch(saveConsultant(m as any as ConsultantModel) as any),
    filters,
    setFilters: f => dispatch(updateAppFilters(Features.consultants, f)),
  };

  const feature = consultantFeature(config);

  return (
    <ListPage feature={feature} />
  );
};
