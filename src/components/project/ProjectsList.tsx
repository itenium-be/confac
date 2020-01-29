import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, Link} from 'react-router-dom';
import {ConfacState} from '../../reducers/app-state';
import {saveProject, updateAppFilters} from '../../actions';
import {ProjectReferenceResolver} from './utils/ProjectReferenceResolver';
import {ListPage} from '../controls/table/ListPage';
import {projectFeature, ProjectFeatureBuilderConfig} from './models/getProjectFeature';
import {Icon} from '../controls/Icon';
import {t} from '../utils';
import {ProjectMonthModal} from './controls/ProjectMonthModal';
import {Button} from '../controls/form-controls/Button';


export const ProjectsList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const config: ProjectFeatureBuilderConfig = useSelector((state: ConfacState) => {
    const projects = new ProjectReferenceResolver(state.projects, state.consultants, state.clients).getProjects();

    return {
      data: projects,
      save: m => dispatch(saveProject(m.details, history)),
      filters: state.app.filters.projects,
      setFilters: f => dispatch(updateAppFilters('projects', f)),
    };
  });


  const [modalProjectMonthId, setModalProjectMonthId] = useState<string | null | 'create'>(null);
  const TopToolbar = (
    <>
      {modalProjectMonthId && (
        <ProjectMonthModal show={!!modalProjectMonthId} onClose={() => setModalProjectMonthId(null)} />
      )}
      <Button
        onClick={() => setModalProjectMonthId('create')}
        size="md"
        variant="light"
        icon="fa fa-plus"
      >
        {t('project.newMonth')}
      </Button>
      <Link to="/consultants" className="btn btn-light btn-md">
        {t('consultant.title')}
        <Icon fa="fa fa-arrow-right" size={1} style={{marginLeft: 8}} />
      </Link>
    </>
  );


  const feature = projectFeature(config);
  return (
    <ListPage feature={feature} topToolbar={TopToolbar} />
  );
};
