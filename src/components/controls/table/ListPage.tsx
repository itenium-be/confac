import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {IFeature} from '../feature/feature-models';
import {t} from '../../utils';
import {List} from './List';
import {Button} from '../form-controls/Button';


export const ListPage = ({feature}: {feature: IFeature<any, any>}) => {
  return (
    <Container className="list">
      <Row>
        <Col sm={12}>
          <h1>{t(feature.trans.listTitle)}</h1>
        </Col>
        <Col lg={3} md={12}>
          <Button variant="light" onClick={feature.nav('create')} icon="fa fa-plus" size="sm">
            {t(feature.trans.createNew)}
          </Button>
        </Col>
      </Row>

      <List feature={feature} />
    </Container>
  );
};

//       <Col lg={3} md={6}>
//         <SearchStringInput
//           value={filters.freeClient}
//           onChange={str => this.props.updateInvoiceFilters({...filters, freeClient: str})}
//         />
//       </Col>
//       <Col lg={3} md={6}>
//         <YearsSelect
//           values={filters.clientListYears}
//           years={getInvoiceYears(invoices)}
//           onChange={(values: number[]) => this.props.updateInvoiceFilters({...filters, clientListYears: values || []})}
//           data-tst="filter-years"
//         />
//       </Col>
//       <Col lg={3} md={12}>
//         <Switch
//           value={this.state.showDeleted}
//           onChange={(checked: boolean) => this.setState({showDeleted: checked})}
//           label={t('client.showInactive')}
//           onColor="#F2DEDE"
//         />
//       </Col>
