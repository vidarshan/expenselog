import { BarChart } from "@mantine/charts";
import { Card, Group, Select, Text } from "@mantine/core";
import { IoCalendarOutline } from "react-icons/io5";

const ComparisonChart = ({ monthlyComparison }) => {
  return (
    <Card h="100%" shadow="xl" withBorder>
      <Group justify="space-between" mb="lg">
        <Text fw={700}>Comparing to previous month</Text>
        <Group>
          <Select
            leftSection={<IoCalendarOutline />}
            size="xs"
            placeholder="Pick month"
            data={["January", "February", "March", "April"]}
          />
          <Select
            leftSection={<IoCalendarOutline />}
            size="xs"
            w={120}
            placeholder="Pick year"
            data={["2022", "2023", "2024", "2025"]}
          />
        </Group>
      </Group>
      {monthlyComparison != undefined && (
        <BarChart
          h={300}
          data={monthlyComparison?.data}
          dataKey="category"
          series={[
            { name: monthlyComparison.labels.a, color: "violet.6" },
            { name: monthlyComparison.labels.b, color: "green.6" },
          ]}
          tickLine="y"
        />
      )}
    </Card>
  );
};

export default ComparisonChart;
