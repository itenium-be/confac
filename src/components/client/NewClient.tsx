import React, { useState } from "react";
import { ClientModel } from "./models/ClientModels";
import { Container, Row, Form, Col } from "react-bootstrap";
import { t } from "../util";
import { BtwInput, BtwResponse, formatBtw } from "../controls/form-controls/inputs/BtwInput";

type NewClientProps = {
  client: ClientModel,
  onChange: (client: ClientModel) => void,
}


export const NewClient = (props: NewClientProps) => {
  const [client, setClient] = useState<ClientModel | null>(null);

  const onBtwChange = (res: BtwResponse) => {
    setClient({
      name: res.name,
      btw: formatBtw(`${res.countryCode}${res.vatNumber}`),
      address: `${res.address.street} ${res.address.number}`,
      city: `${res.address.zip_code} ${res.address.city}`,
    } as ClientModel)
  };

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <h1>{t('client.createNew')}</h1>
        </Row>
        <Row>
          <Col md={6} sm={12}>
            <BtwInput
              value={props.client.btw}
              onChange={(val: string) => {}}
              onBtwChange={onBtwChange}
              onFinalize={(btw: string) => client ? props.onChange(client) : props.onChange({btw} as ClientModel)}
            />
          </Col>
        </Row>
        {client && <Row style={{marginTop: 25}}>
          <Col md={6} sm={12}>
            <h3>{client.name}</h3>
            <div>{client.address}</div>
            <div>{client.city}</div>
          </Col>
        </Row>}
      </Form>
    </Container>
  );
}
