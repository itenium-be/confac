import { PureComponent } from "react";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { clientChartData } from "./ClientsAndProjectsEvolution";

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
        <XAxis dataKey="month" interval={0} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="clients"
          stroke="#8884d8"
          name="Clients"
        />
        <Line
          type="monotone"
          dataKey="clientsWithProjects"
          stroke="#FF0000"
          name="Clients with projects"
        />
      </LineChart>
    </>
  );
};

export default ClientsAndProjectsEvolutionChart;

