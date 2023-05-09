import { t } from "../utils";
import MeasurementsAccordion from "./MeasurementsAccordion";

import './Home.scss';

const Home = () => {
  return (
    <>
      <h1>{t("nav.home")}</h1>
      <MeasurementsAccordion />
    </>
  );
};

export default Home;
