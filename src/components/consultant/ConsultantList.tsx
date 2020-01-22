import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';



export type FeatureConfig<TModel> = {
  rows: TModel[];
  list: FeatureListConfig<TModel>;
}




type TableComponentProps<TModel> = {
  config: FeatureListConfig<TModel>;

}

export type FeatureListConfig<TModel> = {
  // header: () => React.ReactNode,

}


// export const TableComponent = ({config}: TableComponentProps<any>) => {
//   return (
//     <Table size="sm" style={{marginTop: 10}}>
//       <thead>
//         <tr>
//           {config.header()}
//         </tr>
//       </thead>
//       <tbody>
//         {filteredProjects.map(project => (
//           <ProjectsListRow project={project} key={project.details._id} />
//         ))}
//       </tbody>
//     </Table>
//   )
// };
