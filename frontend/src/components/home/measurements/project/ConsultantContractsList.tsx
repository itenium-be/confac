import React from "react";
import { useProjects } from "../../../hooks/useProjects";
import { Table } from "react-bootstrap";
import { t } from "../../../utils";
import { FullProjectModel } from "../../../project/models/FullProjectModel";
import { Link } from "react-router-dom";

export enum ContractType {
  All,
  Work,
  Framework,
}

const ConsultantContractsList = () => {
  const projects = useProjects();

  const projectsWithoutContract = filterConsultantContractProjects(
    projects,
    ContractType.All
  ).length;
  const projectsWithoutWorkContract = filterConsultantContractProjects(
    projects,
    ContractType.Work
  ).length;
  const projectsWithoutFrameworkAgreements = filterConsultantContractProjects(
    projects,
    ContractType.Framework
  ).length;

  return (
    <>
      <Link to={`/projects`}>
        <h5>{t("measurements.projectSection.consultantContracts.title")}</h5>
      </Link>
      <Table>
        <thead>
          <tr>
            <th scope="col">
              {t(
                "measurements.projectSection.consultantContracts.list.projectsWithoutContract"
              )}
            </th>
            <th scope="col">
              {t(
                "measurements.projectSection.consultantContracts.list.projectsWithoutWorkContract"
              )}
            </th>
            <th scope="col">
              {t(
                "measurements.projectSection.consultantContracts.list.projectsWithoutFrameworkAgreements"
              )}
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
    </>
  );
};

export default ConsultantContractsList;

export function filterConsultantContractProjects(
  projects: FullProjectModel[],
  contractType: ContractType
): FullProjectModel[] {
  if (contractType === ContractType.All) {
    return projects.filter((project) => project.isWithoutContract());
  }
  if (contractType === ContractType.Work) {
    return projects.filter((project) => project.isWithoutWorkContract());
  }
  if (contractType === ContractType.Framework) {
    return projects.filter((project) => project.isWithoutFrameworkAgreement());
  }
  return [];
}
