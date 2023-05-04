import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { clientChartData } from "./ClientsAndProjectsEvolution";
import { t } from "../../../utils";

interface Props {
  data: clientChartData[];
}

const ClientsAndProjectsEvolutionChart = ({ data }: Props) => {
  return (
    <>
      <LineChart
        width={500}
        height={300}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        data={data}
      >
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="clients"
          stroke="#8884d8"
          name={t('measurements.clientSection.clientsAndProjectsEvolution.list.clients')}
        />
        <Line
          type="monotone"
          dataKey="clientsWithProjects"
          stroke="#FF0000"
          name={t('measurements.clientSection.clientsAndProjectsEvolution.list.clientsWithProjects')}
        />
      </LineChart>
    </>
  );
};

export default ClientsAndProjectsEvolutionChart;

