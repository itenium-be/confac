import { t } from "../utils";
import { MeasurementsAccordion } from "./MeasurementsAccordion";

import "./Home.scss";

export const Home = () => {
  return (
    <>
      <h1>{t("nav.home")}</h1>
      <MeasurementsAccordion />
    </>
  );
};
