export {}

// import React from 'react';
// import {IFeature} from '../../controls/feature/feature-models';
// import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
// import {ProjectMonthListFilters} from '../../controls/table/table-models';
// import {List} from '../../controls/table/List';
// import {ProjectMonthListCollapsed} from './toolbar/ProjectMonthListCollapsed';
// import { OpenedProjectsMonthsListToolbar } from './toolbar/OpenedProjectsMonthsListToolbar';


// type OpenedProjectMonthsListProps = {
//   feature: IFeature<FullProjectMonthModel, ProjectMonthListFilters>;
//   month: string;
// }

// /** A full open ProjectMonth with toolbar + table */
// export const OpenedProjectMonthsList = ({feature, month}: OpenedProjectMonthsListProps) => {
//   if (!feature.list.data.length || !feature.list.filter) {
//     return null;
//   }

//   const filter = feature.list.filter;
//   if (filter.state.openMonths[month]) {
//     const onClose = () => filter.updateFilter({
//       ...filter.state,
//       openMonths: {...filter.state.openMonths, [month]: false},
//     });
//     return (
//       <>
//         <OpenedProjectsMonthsListToolbar feature={feature} onClose={onClose} />
//         <List feature={feature} />
//         <hr className="list-separator" />
//       </>
//     );
//   }

//   // TODO: this is probably it? If it's collapsed, we don't need the feature either
//   return (
//     <ProjectMonthListCollapsed
//       feature={feature}
//       onOpen={() => {
//         const newFilter = {
//           ...filter.state,
//           openMonths: {...filter.state.openMonths, [month]: true}
//         };
//         filter.updateFilter(newFilter);
//       }}
//     />
//   );
// };
