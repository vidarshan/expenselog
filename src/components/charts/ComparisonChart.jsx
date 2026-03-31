import { BarChart } from "@mantine/charts";
import { Badge, Group, Stack, Text } from "@mantine/core";
import { IoGitCompareOutline } from "react-icons/io5";
import ChartPanel from "./ChartPanel";

const ComparisonChart = ({ monthlyComparison }) => {
  const hasData =
    monthlyComparison?.data && monthlyComparison.data.length > 0;

  return (
    <ChartPanel
      icon={<IoGitCompareOutline size={20} />}
      title="Month-to-Month Comparison"
      eyebrow="Category shifts"
      accent="pink"
      description="Compare category spend between the selected month and the one before it to spot where behavior is moving."
      action={
        hasData ? (
          <Group gap="xs">
            <Badge variant="light" color="violet">
              {monthlyComparison.labels.a}
            </Badge>
            <Badge variant="light" color="lime">
              {monthlyComparison.labels.b}
            </Badge>
          </Group>
        ) : null
      }
    >
      {hasData ? (
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Bars are grouped by category so you can see which spending areas are rising, falling, or holding steady.
          </Text>
          <BarChart
            h={320}
            data={monthlyComparison.data}
            dataKey="category"
            tickLine="none"
            gridAxis="y"
            barProps={{ radius: [10, 10, 0, 0] }}
            xAxisProps={{ tickMargin: 12 }}
            yAxisProps={{ width: 56 }}
            series={[
              { name: monthlyComparison.labels.a, color: "violet.5" },
              { name: monthlyComparison.labels.b, color: "lime.5" },
            ]}
          />
        </Stack>
      ) : (
        <Text size="sm" c="dimmed">
          Comparison data is not available for these periods yet.
        </Text>
      )}
    </ChartPanel>
  );
};

export default ComparisonChart;
