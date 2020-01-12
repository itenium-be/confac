import React, {useState} from 'react';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {ClientModel} from './models/ClientModels';
import {t} from '../utils';
import {BtwInput, BtwResponse, formatBtw} from '../controls/form-controls/inputs/BtwInput';

type NewClientProps = {
  client: ClientModel,
  onChange: (client: ClientModel) => void,
}

export function btwResponseToModel(btw: BtwResponse): ClientModel {
  return {
    name: btw.name,
    btw: formatBtw(`${btw.countryCode}${btw.vatNumber}`),
    address: `${btw.address.street} ${btw.address.number}`,
    city: `${btw.address.zip_code} ${btw.address.city}`,
  } as ClientModel;
}


export const NewClient = (props: NewClientProps) => {
  const [client, setClient] = useState<ClientModel | null>(null);
  const [btw, setBtw] = useState(props.client.btw);

  const onBtwChange = (res: BtwResponse) => {
    setClient(btwResponseToModel(res));
  };

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <h1>{t('client.createNew')}</h1>
        </Row>
        <Row>
          <Col lg={8} md={10} sm={12}>
            <BtwInput
              value={btw}
              onChange={(val: string) => setBtw(val)}
              onBtwChange={onBtwChange}
              onFinalize={(btw: string) => (client ? props.onChange(client) : props.onChange({btw: btw || ' '} as ClientModel))}
            />
          </Col>
        </Row>
        {client && (
        <Row style={{marginTop: 25}}>
          <Col md={6} sm={12}>
            <h3>{client.name}</h3>
            <div>{client.address}</div>
            <div>{client.city}</div>
          </Col>
        </Row>
        )}
      </Form>
    </Container>
  );
};
