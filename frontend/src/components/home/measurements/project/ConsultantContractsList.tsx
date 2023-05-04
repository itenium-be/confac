import React from "react";
import { useProjects } from "../../../hooks/useProjects";
import { ContractStatus } from "../../../client/models/ContractModels";
import { Table } from "react-bootstrap";
import { t } from "../../../utils";

const ConsultantContractsList = () => {
  const projects = useProjects();

  const projectsWithoutContract = projects.filter(
    (project) =>
      (project.details.contract.status !== ContractStatus.BothSigned &&
        project.details.contract.status !== ContractStatus.NotNeeded) ||
      (project.client.frameworkAgreement.status !== ContractStatus.BothSigned &&
        project.client.frameworkAgreement.status !== ContractStatus.NotNeeded)
  ).length;
  const projectsWithoutWorkContract = projects.filter(
    (project) =>
      project.details.contract.status !== ContractStatus.BothSigned &&
      project.details.contract.status !== ContractStatus.NotNeeded
  ).length;
  const projectsWithoutFrameworkAgreements = projects.filter(
    (project) =>
      project.client.frameworkAgreement.status !== ContractStatus.BothSigned &&
      project.client.frameworkAgreement.status !== ContractStatus.NotNeeded
  ).length;

  return (
    <>
      <h5>{t("measurements.projectSection.consultantContracts.title")}</h5>
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

