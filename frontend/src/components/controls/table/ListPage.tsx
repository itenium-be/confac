import {Container, Row, Col} from 'react-bootstrap';
import {IFeature} from '../feature/feature-models';
import {t} from '../../utils';
import {List} from './List';
import {Button} from '../form-controls/Button';
import {SearchStringInput} from '../form-controls/inputs/SearchStringInput';
import {Switch} from '../form-controls/Switch';
import {ListFilters} from './table-models';
import {GenericClaim} from '../../users/models/UserModel';
import {ClaimGuard} from '../../enhancers/EnhanceWithClaim';



type ListPageProps = {
  feature: IFeature<any, any>;
  /** Renders at the title level */
  topToolbar?: any;
}



export const ListPageHeader = ({feature, topToolbar}: ListPageProps) => (
  <Row>
    <Col sm={6}>
      <h1>
        {feature.list.listTitle ? feature.list.listTitle() : t(feature.trans.listTitle)}
      </h1>
    </Col>
    <Col sm={6} className="list-top-toolbar">
      {topToolbar}
    </Col>
    {feature.trans.createNew && (
      <ClaimGuard feature={{key: feature.key, claim: GenericClaim.Create}}>
        <Col lg={3} md={3}>
          <Button variant="light" onClick={feature.nav('create')} icon="fa fa-plus">
            {t(feature.trans.createNew)}
          </Button>
        </Col>
      </ClaimGuard>
    )}
    <ListPageFilters feature={feature} />
  </Row>
);


export const ListPage = ({feature, topToolbar}: ListPageProps) => (
  <Container className={`list list-${feature.key}`}>
    <ListPageHeader feature={feature} topToolbar={topToolbar} />
    <List feature={feature} />
  </Container>
);



export const ListPageFilters = ({feature}: {feature: IFeature<any, ListFilters>}) => {
  const components: React.ReactNode[] = [];

  const {filter} = feature.list;
  if (filter) {
    if (filter.fullTextSearch) {
      components.push(
        <SearchStringInput
          value={filter.state.freeText}
          onChange={str => filter.updateFilter({...filter.state, freeText: str})}
        />,
      );
    }

    if (filter.extras) {
      components.push(filter.extras());
    }

    if (filter.softDelete) {
      components.push(
        <Switch
          value={filter.state.showInactive}
          onChange={(checked: boolean) => filter.updateFilter({...filter.state, showInactive: checked})}
          label={t('feature.showInactive')}
          onColor="#F2DEDE"
        />,
      );
    }
  }

  return (
    <>
      {components.map((c, i) => <Col lg={3} md={6} key={i}>{c}</Col>)}
    </>
  );
};
