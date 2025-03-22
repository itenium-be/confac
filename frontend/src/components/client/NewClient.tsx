import { useState } from 'react';
import { Container, Row, Form } from 'react-bootstrap';
import { ClientModel, ClientType } from './models/ClientModels';
import { t } from '../utils';
import { BtwInput, BtwResponse } from '../controls/form-controls/inputs/BtwInput';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getNewClient } from './models/getNewClient';
import { useSelector } from 'react-redux';
import { ConfacState } from '../../reducers/app-state';
import { countries } from '../controls/other/CountrySelect';
import { btwResponseToModel, useClientAlreadyExists } from './client-helpers';
import { Alert } from 'react-bootstrap';


type NewClientProps = {
  onChange: (client: ClientModel) => void,
}

/**
 * Enter a btw nr with lookup company details with external API
 * and display those details.
 * Allow creation with "btw in aanvraag"
 **/
export const NewClient = ({onChange}: NewClientProps) => {
  useDocumentTitle('clientNew');

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <h1>{t('client.createNew')}</h1>
        </Row>
        <NewClientForm
          onFinalize={onChange}
          fullWidth={false}
        />
      </Form>
    </Container>
  );
};



type NewClientFormProps = {
  onFinalize: (client: ClientModel) => void;
  /** Full width on a modal but on a full screen make the btw input smaller */
  fullWidth: boolean;
  newClientTypes?: ClientType[];
}


export const NewClientForm = ({onFinalize, fullWidth, newClientTypes}: NewClientFormProps) => {
  const config = useSelector((state: ConfacState) => state.config);
  const [btw, setBtw] = useState<string>('');
  const [btwResponse, setBtwResponse] = useState<ClientModel | null>(null);

  const clientAlreadyExists = useClientAlreadyExists(btwResponse);

  return (
    <>
      <Row>
        <div className={fullWidth ? '' : 'col-lg-8 col-md-10 col-sm-12'}>
          <BtwInput
            value={btw}
            onChange={(val: string) => setBtw(val)}
            onFinalize={(btw: string, btwResp?: BtwResponse) => {
              if (btwResp && btwResp.valid) {
                onFinalize(btwResponseToModel(config, btwResp, newClientTypes));
              } else {
                onFinalize({...getNewClient(config), btw });
              }
            }}
            onBtwChange={btw => setBtwResponse(btwResponseToModel(config, btw, newClientTypes))}
          />
        </div>
      </Row>
      {btwResponse && (
        <Row>
          <div className={fullWidth ? '' : 'col-lg-8 col-md-10 col-sm-12'}>
            {clientAlreadyExists && (
              <Alert variant="danger">{t('client.alreadyExists', {btw: btwResponse.btw})}</Alert>
            )}
            <h3>{btwResponse.name}</h3>
            <div>{btwResponse.address}</div>
            <div>{btwResponse.postalCode} {btwResponse.city}</div>
            <div>{countries.find(x => x.value === btwResponse.country)?.label || btwResponse.country}</div>
          </div>
        </Row>
      )}
    </>
  );
};
