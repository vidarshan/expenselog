import { useState } from "react";
import { Badge, Box, Card, Group, SegmentedControl, Text } from "@mantine/core";
import { PieChart } from "@mantine/charts";

const ContributionChart = ({ categoryBreakdown }) => {
  const [mode, setMode] = useState("percent");
  const totalSum = categoryBreakdown.reduce((sum, x) => sum + x.total, 0);

  const pieData = categoryBreakdown.map((x) => ({
    id: x.categoryId,
    name: x.categoryName,
    value: x.total,
    color: x.color,
    percentage:
      totalSum === 0 ? 0 : Number(((x.total / totalSum) * 100).toFixed(1)),
  }));

  return (
    <Card h="100%" shadow="xl" withBorder>
      <Group justify="space-between" mb="lg">
        <Text fw={700}>Contributions</Text>

        <SegmentedControl
          size="xs"
          color=""
          orientation="horizontal"
          value={mode}
          data={[
            { label: "Values", value: "value" },
            { label: "Percentages", value: "percent" },
          ]}
          onChange={(value) => {
            setMode(value);
          }}
        />
      </Group>
      <Group h="100%" justify="center">
        <PieChart
          withLabelsLine
          withTooltip
          tooltipDataSource="segment"
          labelsPosition="outside"
          labelsType={mode}
          withLabels
          data={pieData}
        />
        <Box>
          {pieData.map(({ name, value, percentage, color }) => {
            return (
              <Group key={name + "-" + value} mb="xs" justify="space-between">
                <Badge color={color} variant="dot">
                  {" "}
                  {name} — {mode === "percent" ? percentage + "%" : value}
                </Badge>
              </Group>
            );
          })}
        </Box>
      </Group>
    </Card>
  );
};

export default ContributionChart;
