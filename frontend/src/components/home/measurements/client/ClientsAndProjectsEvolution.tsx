import { Row } from "react-bootstrap";
import { ClientsAndProjectsEvolutionChart } from "./ClientsAndProjectsEvolutionChart";
import { ClientsAndProjectsEvolutionList } from "./ClientsAndProjectsEvolutionList";
import { Container } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { useState } from "react";
import moment, { Moment } from "moment";
import { useSelector } from "react-redux";
import { ConfacState } from "../../../../reducers/app-state";
import { t } from "../../../utils";
import { Link } from "react-router-dom";
import { PeriodPicker } from "../PeriodPicker";

export interface ClientChartData {
  year: number;
  monthIndex: number;
  month: string;
  clients: number | null;
  clientsWithProjects: number | null;
}

export interface DateRange {
  from: Moment;
  to: Moment;
}

export const ClientsAndProjectsEvolution = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: moment(),
    to: moment().add(11, "month"),
  });
  const models = useSelector((state: ConfacState) => ({
    clients: state.clients,
    projects: state.projects,
  }));

  const interim = dateRange.from.clone();
  const timeValues: Moment[] = [];

  while (interim.startOf("month").isSameOrBefore(dateRange.to.endOf("month"))) {
    timeValues.push(interim.clone());
    interim.add(1, "month");
  }

  const dataSet: ClientChartData[] = timeValues.map((date) => {
    return {
      year: date.year(),
      /**month index starts from 0 for January */
      monthIndex: date.month(),
      /**format is localized up to 3 letters so Jan, Feb... */
      month: date.format("MMM"),
      clients: null,
      clientsWithProjects: null,
    };
  });

  const clientsWithProject = models.clients.map((client) => {
    return {
      detail: client,
      projects: models.projects.filter((project) => project.client.clientId === client._id),
    };
  });

  let count: number = 0;
  dataSet.forEach((entry) => {
    const amount: number = models.clients
      .filter((client) => moment.utc(client.audit.createdOn).year() === entry.year)
      .filter((client) => moment.utc(client.audit.createdOn).month() === entry.monthIndex).length;
    count += amount;
    entry.clients = count;
  });

  /* Here I check if a client has a project with a start and enddate
  that is valid for the month and year pairs in the dataset and count them up for the year and month pairs. */

  dataSet.forEach((entry) => {
    entry.clientsWithProjects = clientsWithProject
      .filter((client) => client.projects.length > 0)
      .filter((client) =>
        client.projects.some((project) =>
          isBetween(entry, project.startDate, project.endDate)
        )
      ).length;
  });

  // For the clients with projects column in the list
  // I want to check and count the unique clients with a valid contract in the whole period -> I store this
  // separately inside allClientsWithProjects

  const allClientsWithProjects = clientsWithProject
    .filter((client) => client.projects.length > 0)
    .filter((client) =>
      client.projects.some(
        (project) =>
          project?.startDate.isSameOrBefore(dateRange.to) &&
          (project.endDate === undefined || project.endDate === null || project.endDate.isSameOrAfter(dateRange.from))
      )
    ).length;

  return (
    <Container>
      <Row>
        <Link to={`/clients`}>
          <h5>
            {t("measurements.clientSection.clientsAndProjectsEvolution.title")}
          </h5>
        </Link>
        <ClientsAndProjectsEvolutionList
          dateRange={dateRange}
          clients={dataSet[dataSet.length - 1].clients || 0}
          clientsWithProject={allClientsWithProjects}
        />
      </Row>
      <Row>
        <Col className="align-items-bottom">
          <PeriodPicker dateRange={dateRange} setDateRange={setDateRange} />
        </Col>
        <Col>
          <ClientsAndProjectsEvolutionChart data={dataSet} />
        </Col>
      </Row>
    </Container>
  );
};

export function isBetween(
  entry: ClientChartData,
  startDate?: Moment,
  endDate?: Moment
): boolean {
  return moment([entry.year, entry.monthIndex]).isBetween(startDate, endDate);
}
