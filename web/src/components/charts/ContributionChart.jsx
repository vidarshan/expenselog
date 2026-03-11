import React, { useState } from "react";
import { Badge, Box, Card, Group, SegmentedControl, Text } from "@mantine/core";
import { Heatmap, PieChart } from "@mantine/charts";
import { useSelector } from "react-redux";

const palette = [
  "blue.6",
  "cyan.6",
  "teal.6",
  "green.6",
  "lime.6",
  "yellow.6",
  "orange.6",
  "red.6",
  "pink.6",
  "grape.6",
  "violet.6",
  "indigo.6",

  "blue.4",
  "cyan.4",
  "teal.4",
  "green.4",
  "lime.4",
  "yellow.4",
  "orange.4",
  "red.4",
  "pink.4",
  "grape.4",
  "violet.4",
  "indigo.4",

  "blue.8",
  "cyan.8",
  "teal.8",
  "green.8",
  "lime.8",
  "yellow.8",
  "orange.8",
  "red.8",
  "pink.8",
  "grape.8",
  "violet.8",
  "indigo.8",
];

const ContributionChart = ({ categoryBreakdown }) => {
  const [mode, setMode] = useState("percent");
  const totalSum = categoryBreakdown.reduce((sum, x) => sum + x.total, 0);
  console.log("categoryBreakdown", categoryBreakdown);
  const { transactions } = useSelector((state) => state.transactions);
  const pieData = categoryBreakdown.map((x) => ({
    id: x.categoryId, // optional
    name: x.categoryName, // label
    value: x.total, // numeric value used for slices
    color: x.color,
    percentage:
      totalSum === 0 ? 0 : Number(((x.total / totalSum) * 100).toFixed(1)),
  }));

  console.log(transactions);

  return (
    <Card h="100%" shadow="xl" withBorder>
      <Group justify="space-between" mb="lg">
        <Text fw={700}>Contributions</Text>
        {/* <Heatmap
          data={heatmapData}
          withTooltip
          startDate="2026-01-01"
          endDate="2026-03-10"
          getTooltipLabel={({ value }) =>
            `${value === null || value === 0 ? "$0" : `$${value}`}`
          }
        /> */}
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
