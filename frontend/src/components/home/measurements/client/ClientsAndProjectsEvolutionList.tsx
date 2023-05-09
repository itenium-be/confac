import { Table } from "react-bootstrap";
import { Moment } from "moment";
import { t } from "../../../utils";

interface Props {
  from: Moment;
  to: Moment;
  clients: number;
  clientsWithProject: number;
}
const ClientsAndProjectsEvolutionList = ({
  from,
  to,
  clients,
  clientsWithProject,
}: Props) => {
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
            <td>{`${from.format("MM/YYYY")} - ${to.format("MM/YYYY")}`}</td>
            <td>{clients}</td>
            <td>{clientsWithProject}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default ClientsAndProjectsEvolutionList;

