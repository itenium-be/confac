import { t } from "../utils";
import { Accordion } from "react-bootstrap";
import { ProjectSection } from "./sections/ProjectSection";
import { ClientSection } from "./sections/ClientSection";
import { InvoiceSection } from "./sections/InvoiceSection";

export const MeasurementsAccordion = () => {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <h3>{t("nav.projects")}</h3>
        </Accordion.Header>
        <Accordion.Body>
          <ProjectSection />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          <h3>{t("nav.clients")}</h3>
        </Accordion.Header>
        <Accordion.Body>
          <ClientSection />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>
          <h3>{t("nav.invoices")}</h3>
        </Accordion.Header>
        <Accordion.Body>
          <InvoiceSection />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
