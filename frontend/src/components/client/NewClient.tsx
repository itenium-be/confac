import {useState} from 'react';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {ClientModel} from './models/ClientModels';
import {t} from '../utils';
import {BtwInput, BtwResponse, formatBtw} from '../controls/form-controls/inputs/BtwInput';
import {useDocumentTitle} from '../hooks/useDocumentTitle';

type NewClientProps = {
  client: ClientModel,
  onChange: (client: ClientModel) => void,
}

/** Returns a partial ClientModel with the data from the BTW lookup */
export function btwResponseToModel(btw: BtwResponse): ClientModel {
  return {
    name: btw.name,
    btw: formatBtw(`${btw.countryCode}${btw.vatNumber}`),
    address: `${btw.address.street} ${btw.address.number}`,
    city: `${btw.address.zip_code} ${btw.address.city}`,
    country: btw.address.country,
  } as ClientModel;
}


/**
 * Enter a btw nr with lookup company details with external API
 * and display those details.
 * Allow creation with "btw in aanvraag"
 **/
export const NewClient = (props: NewClientProps) => {
  useDocumentTitle('clientNew');
  const [client, setClient] = useState<ClientModel | null>(null);
  const [btw, setBtw] = useState<string>(props.client.btw);

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
              onFinalize={(val: string) => {
                return (client ? props.onChange(client) : props.onChange({btw: val || ' '} as ClientModel))
              }}
            />
          </Col>
        </Row>
        {client && (
          <Row style={{marginTop: 25}}>
            <Col md={6} sm={12}>
              <h3>{client.name}</h3>
              <div>{client.address}</div>
              <div>{client.city}</div>
              <div>{client.country}</div>
            </Col>
          </Row>
        )}
      </Form>
    </Container>
  );
};
