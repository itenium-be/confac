import { t } from "../utils"
import MeasurementAccordion from "./measurements/MeasurementAccordion"

const Home = () => {
  return (
    <>
    <h1>{t("nav.home")}</h1>
    <MeasurementAccordion />
    </>
  )
}

export default Home