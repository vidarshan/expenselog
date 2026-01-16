import React from "react";
import { expenseData } from "../../data/mockdata";
import { Box, Card, Group, SegmentedControl, Text } from "@mantine/core";
import { PieChart } from "@mantine/charts";

const ContributionChart = () => {
  return (
    <Card h="100%" shadow="xl" withBorder>
      <Group justify="space-between" mb="lg">
        <Text fw={700}>Contributions</Text>
        <SegmentedControl
          size="xs"
          orientation="horizontal"
          data={["Percentage", "Values"]}
        />
      </Group>
      <Group justify="center">
        <PieChart
          withLabelsLine
          withTooltip
          tooltipDataSource="segment"
          labelsPosition="outside"
          labelsType="percent"
          withLabels
          data={expenseData}
        />
        <Box>
          {expenseData.map(({ name, value }) => {
            return (
              <Group key={name + "-" + value} mb="xs" justify="space-between">
                <Text size="xs">{name}</Text>
                <Text size="xs">{value}</Text>
              </Group>
            );
          })}
        </Box>
      </Group>
    </Card>
  );
};

export default ContributionChart;
