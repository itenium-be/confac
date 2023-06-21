import { Table } from "react-bootstrap";
import { t } from "../../../utils";
import { DateRange } from "./ClientsAndProjectsEvolution";

interface ClientsAndProjectsEvolutionListProps {
  dateRange: DateRange;
  clients: number;
  clientsWithProject: number;
}
export const ClientsAndProjectsEvolutionList = ({ dateRange, clients, clientsWithProject }: ClientsAndProjectsEvolutionListProps) => {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th scope="col">{t('measurements.clientSection.clientsAndProjectsEvolution.list.period')}</th>
            <th scope="col">{t('measurements.clientSection.clientsAndProjectsEvolution.list.clients')}</th>
            <th scope="col">{t('measurements.clientSection.clientsAndProjectsEvolution.list.clientsWithProjects')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{`${dateRange.from.format("MM/YYYY")} - ${dateRange.to.format("MM/YYYY")}`}</td>
            <td>{clients}</td>
            <td>{clientsWithProject}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

