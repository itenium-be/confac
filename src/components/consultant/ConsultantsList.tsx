import React from 'react';
import {useSelector} from 'react-redux';
import {ConfacState} from '../../reducers/app-state';
import {ListPage} from '../controls/table/ListPage';
import {consultantFeature} from './models/getConsultantFeature';


export const ConsultantsList = () => {
  const config = useSelector((state: ConfacState) => consultantFeature(state.consultants));
  return (
    <ListPage feature={config} />
  );
};
