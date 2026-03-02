import { BarChart } from "@mantine/charts";
import { Card, Group, Select, Text } from "@mantine/core";
import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { categoryMonthlyComparison } from "../../data/mockdata";

const ComparisonChart = () => {
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
      <BarChart
        h={300}
        data={categoryMonthlyComparison}
        dataKey="category"
        series={[
          { name: "January", color: "violet.6" },
          { name: "February", color: "blue.6" },
        ]}
        tickLine="y"
      />
    </Card>
  );
};

export default ComparisonChart;
