import React, { useState } from "react";
import { connect } from "react-redux";
import { Container, Row, Form } from "react-bootstrap";

import { ConfacState } from "../../reducers/app-state";
import { t } from "../util";
import { ArrayInput } from "../controls/form-controls/inputs/ArrayInput";
import { defaultConsultantProperties, ConsultantModel } from "./models";
import { BusyButton } from "../controls";
import { saveConsultant } from "../../actions";
import { StickyFooter } from "../controls/skeleton/StickyFooter";

interface EditConsultantProps {
  saveConsultant: (consultant: ConsultantModel) => void;
}

const EditConsultant = (props: EditConsultantProps) => {
  const [consultant, setConsultant] = useState<ConsultantModel>({
    name: "",
    firstName: "",
    type: "consultant",
    email: "",
    telephone: ""
  });

  const onSaveConsultant = (): void => {
    props.saveConsultant(consultant);
  };

  const isButtonDisabled = (): boolean => {
    const { name, firstName } = consultant;

    if (!name || !firstName) {
      return true;
    }
    return false;
  };

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <h1>{t("consultant.createNew")}</h1>
        </Row>
        <Row>
          <ArrayInput
            config={defaultConsultantProperties}
            model={consultant}
            onChange={(value: { [key: string]: any }) =>
              setConsultant({ ...consultant, ...value })
            }
            tPrefix="consultant."
          />
        </Row>
      </Form>
      <StickyFooter>
        <BusyButton
          onClick={onSaveConsultant}
          disabled={isButtonDisabled()}
          data-tst="save"
        >
          {t("save")}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};

const mapStateToProps = (state: ConfacState) => ({});

export default connect(mapStateToProps, { saveConsultant })(EditConsultant);
