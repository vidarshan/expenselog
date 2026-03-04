import React, { useState } from "react";
import { expenseData } from "../../data/mockdata";
import { Box, Card, Group, SegmentedControl, Text } from "@mantine/core";
import { PieChart } from "@mantine/charts";

const ContributionChart = ({ categoryBreakdown }) => {
  const [mode, setMode] = useState("percent");
  const totalSum = categoryBreakdown.reduce((sum, x) => sum + x.total, 0);

  const pieData = categoryBreakdown.map((x) => ({
    id: x.categoryId, // optional
    name: x.categoryName, // label
    value: x.total, // numeric value used for slices
    percentage:
      totalSum === 0 ? 0 : Number(((x.total / totalSum) * 100).toFixed(1)),
  }));

  console.log(mode);

  return (
    <Card h="100%" shadow="xl" withBorder>
      <Group justify="space-between" mb="lg">
        <Text fw={700}>Contributions</Text>
        <SegmentedControl
          size="xs"
          orientation="horizontal"
          data={[
            { label: "Values", value: "value" },
            { label: "Percentages", value: "percent" },
          ]}
          onChange={(value) => {
            setMode(value);
          }}
        />
      </Group>
      <Group justify="center">
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
          {pieData.map(({ name, value, percentage }) => {
            return (
              <Group key={name + "-" + value} mb="xs" justify="space-between">
                <Text size="xs">{name}</Text>
                <Text size="xs">
                  {mode === "percent" ? percentage + "%" : value}
                </Text>
              </Group>
            );
          })}
        </Box>
      </Group>
    </Card>
  );
};

export default ContributionChart;
