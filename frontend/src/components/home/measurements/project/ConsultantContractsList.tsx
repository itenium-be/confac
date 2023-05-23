import { useProjects } from "../../../hooks/useProjects";
import { Table } from "react-bootstrap";
import { t } from "../../../utils";
import { FullProjectModel } from "../../../project/models/FullProjectModel";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";

export enum ContractType {
  All,
  Work,
  Framework,
}

export const ConsultantContractsList = () => {
  const projects = useProjects();

  const projectsWithoutContract = filterConsultantContractProjects(projects, ContractType.All).length;
  const projectsWithoutWorkContract = filterConsultantContractProjects(projects,ContractType.Work).length;
  const projectsWithoutFrameworkAgreements = filterConsultantContractProjects(projects,ContractType.Framework).length;

  return (
    <Container>
      <Row>
        <Link to={`/projects`}>
          <h5>{t("measurements.projectSection.consultantContracts.title")}</h5>
        </Link>
        <Table>
          <thead>
            <tr>
              <th scope="col">
                {t("measurements.projectSection.consultantContracts.list.projectsWithoutContract")}
              </th>
              <th scope="col">
                {t("measurements.projectSection.consultantContracts.list.projectsWithoutWorkContract")}
              </th>
              <th scope="col">
                {t("measurements.projectSection.consultantContracts.list.projectsWithoutFrameworkAgreements")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{projectsWithoutContract}</td>
              <td>{projectsWithoutWorkContract}</td>
              <td>{projectsWithoutFrameworkAgreements}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export function filterConsultantContractProjects(
  projects: FullProjectModel[],
  contractType: ContractType
): FullProjectModel[] {
  return projects.filter((project) => project.isWithoutContract(contractType));
}
