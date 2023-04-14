import { Table } from "react-bootstrap";
import { ContractStatus } from "../../../client/models/ContractModels";
import { useProjects } from "../../../hooks/useProjects";

const ProjectSection = () => {
  let projects = useProjects();

  console.log(projects);

  let projectsWithoutContract = projects.filter(
    (project) =>
      (project.details.contract.status !== ContractStatus.BothSigned &&
        project.details.contract.status !== ContractStatus.NotNeeded) ||
      (project.client.frameworkAgreement.status !== ContractStatus.BothSigned &&
        project.client.frameworkAgreement.status !== ContractStatus.NotNeeded)
  ).length;
  let projectsWithoutWorkContract = projects.filter(
    (project) =>
      project.details.contract.status !== ContractStatus.BothSigned &&
      project.details.contract.status !== ContractStatus.NotNeeded
  ).length;
  let projectsWithoutFrameworkAgreements = projects.filter(
    (project) =>
      project.client.frameworkAgreement.status !== ContractStatus.BothSigned &&
      project.client.frameworkAgreement.status !== ContractStatus.NotNeeded
  ).length;
  return (
    <>
      <h3>Consultant contracts</h3>
      <Table>
        <thead>
          <tr>
            <th scope="col">Projecten zonder contract</th>
            <th scope="col">Geen werkcontract</th>
            <th scope="col">Geen raamcontract</th>
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

export default ProjectSection;

