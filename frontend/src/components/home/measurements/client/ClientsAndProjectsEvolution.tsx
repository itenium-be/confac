import { Row } from "react-bootstrap";
import { MonthPicker } from "../../../controls/form-controls/MonthPicker";
import ClientsAndProjectsEvolutionChart from "./ClientsAndProjectsEvolutionChart";
import ClientsAndProjectsEvolutionList from "./ClientsAndProjectsEvolutionList";
import { Container } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { useState } from "react";
import moment, { Moment } from "moment";
import { useSelector } from "react-redux";
import { ConfacState } from "../../../../reducers/app-state";
import { t } from "../../../utils";
import { Link } from "react-router-dom";

export interface clientChartData {
  year: number;
  monthIndex: number;
  month: string;
  clients: number | null;
  clientsWithProjects: number | null;
}
const ClientsAndProjectsEvolution = () => {
  const [from, setFrom] = useState<moment.Moment>(moment());
  const [to, setTo] = useState<moment.Moment>(from.clone().add(11, "month"));
  const models = useSelector((state: ConfacState) => ({
    clients: state.clients,
    projects: state.projects,
  }));
  console.log(models);

  let interim = from.clone();
  let timeValues: Moment[] = [];

  while (interim.startOf("month").isSameOrBefore(to.endOf("month"))) {
    timeValues.push(interim.clone());
    interim.add(1, "month");
  }

  const dataSet: clientChartData[] = timeValues.map((date) => {
    return {
      year: date.year(),
      monthIndex: date.month(),
      month: date.format("MMM"),
      clients: null,
      clientsWithProjects: null,
    };
  });

  const clientsWithProject = models.clients.map((client) => {
    return {
      detail: client,
      projects: models.projects.filter(
        (project) => project.client.clientId === client._id
      ),
    };
  });

  let count: number = 0;
  dataSet.forEach((entry) => {
    let amount: number = models.clients
      .filter(
        (client) => moment.utc(client.audit.createdOn).year() === entry.year
      )
      .filter(
        (client) =>
          moment.utc(client.audit.createdOn).month() === entry.monthIndex
      ).length;
    count += amount;
    entry.clients = count;
  });

  /* Here I check if a client has a project with a start and enddate 
  that is valid for the month and year pairs in the dataset and count them up for the year and month pairs. */

  dataSet.forEach((entry) => {
    let amount: number = clientsWithProject.filter(
      (client) =>
        client.projects.length > 0 &&
        client.projects.some((project) =>
          moment([entry.year, entry.monthIndex]).isBetween(
            project?.startDate,
            project?.endDate
          )
        )
    ).length;
    entry.clientsWithProjects = amount;
  });

  /* For the clients with projects column in the list 
  I want to check and count the unique clients with a valid contract in the whole period -> I store this
  separately inside allClientsWithProjects */

  let allClientsWithProjects = clientsWithProject.filter(
    (client) =>
      client.projects.length > 0 &&
      client.projects.some(
        (project) =>
          project?.startDate.isSameOrBefore(to) &&
          (project.endDate === undefined || project.endDate.isSameOrAfter(from))
      )
  ).length;

  return (
    <>
      <Link to={`/clients`}>
        <h5>{t("measurements.clientSection.clientsAndProjectsEvolution.title")}</h5>
      </Link>
      <ClientsAndProjectsEvolutionList
        from={from}
        to={to}
        clients={dataSet[dataSet.length - 1].clients || 0}
        clientsWithProject={allClientsWithProjects}
      />
      <Container>
        <Row>
          <Col>
            <MonthPicker
              label={t("measurements.from")}
              value={from}
              onChange={(value) => {
                value && value < to && setFrom(value);
              }}
            />
          </Col>
          <Col>
            <MonthPicker
              label={t("measurements.to")}
              value={to}
              onChange={(value) => {
                value && value > from && setTo(value);
              }}
            />
          </Col>
          <Col>
            <ClientsAndProjectsEvolutionChart data={dataSet} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ClientsAndProjectsEvolution;

