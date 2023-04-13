import ProjectSection from "./sections/ProjectSection";
import MeasurementAccordionItem from "./MeasurementAccordionItem";
import ClientSection from "./sections/ClientSection";
import InvoiceSection from "./sections/InvoiceSection";
import { t } from "../../utils";

const MeasurementAccordion = () => {
  return (
    <div className="accordion" id="measurementAccordion">
      <MeasurementAccordionItem header={t("nav.projects")} isCollapsed={false}>
        <ProjectSection />
      </MeasurementAccordionItem>
      <MeasurementAccordionItem header={t("nav.clients")}>
        <ClientSection />
      </MeasurementAccordionItem>
      <MeasurementAccordionItem header={t("nav.invoices")}>
        <InvoiceSection />
      </MeasurementAccordionItem>
    </div>
  );
};

export default MeasurementAccordion;
