import { useMemo, useState } from "react";
import {
  Badge,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { DonutChart } from "@mantine/charts";
import { IoPieChartOutline } from "react-icons/io5";
import ChartPanel from "./ChartPanel";

const ContributionChart = ({ categoryBreakdown = [], periodLabel }) => {
  const [mode, setMode] = useState("percent");

  const { totalSum, pieData, topCategory } = useMemo(() => {
    const total = categoryBreakdown.reduce((sum, x) => sum + x.total, 0);
    const data = categoryBreakdown.map((x) => ({
      name: x.categoryName,
      value: x.total,
      color: x.color,
      percentage:
        total === 0 ? 0 : Number(((x.total / total) * 100).toFixed(1)),
    }));

    return {
      totalSum: total,
      pieData: data,
      topCategory: [...data].sort((a, b) => b.value - a.value)[0] || null,
    };
  }, [categoryBreakdown]);

  return (
    <ChartPanel
      icon={<IoPieChartOutline size={20} />}
      title="Category Contributions"
      eyebrow="Spending mix"
      accent="orange"
      description={`See which categories dominate ${periodLabel || "the selected period"} and how much each one contributes to the overall expense picture.`}
      action={
        <SegmentedControl
          size="xs"
          radius="xl"
          value={mode}
          data={[
            { label: "Value", value: "value" },
            { label: "%", value: "percent" },
          ]}
          onChange={setMode}
        />
      }
    >
      {pieData.length > 0 ? (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Stack align="center" justify="center" h="100%">
            <DonutChart
              data={pieData}
              withLabelsLine={false}
              withLabels={false}
              withTooltip
              tooltipDataSource="segment"
              size={220}
              thickness={28}
              chartLabel={`Total $${totalSum.toFixed(0)}`}
            />
            <Text size="sm" c="dimmed">
              Total tracked expenses for {periodLabel || "the selected period"}
            </Text>
          </Stack>

          <Stack gap="sm">
            <Paper withBorder radius="lg" p="sm">
              <Text size="xs" c="dimmed">
                Largest category
              </Text>
              <Group justify="space-between" mt={4}>
                <Text fw={700}>{topCategory?.name || "No data yet"}</Text>
                {topCategory ? (
                  <Badge color={topCategory.color} variant="light">
                    {topCategory.percentage}%
                  </Badge>
                ) : null}
              </Group>
            </Paper>

            <Stack gap="xs">
              {pieData.map(({ name, value, percentage, color }) => (
                <Paper key={name} withBorder radius="lg" p="sm">
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                      <Badge color={color} variant="dot">
                        {name}
                      </Badge>
                    </Group>
                    <Text size="sm" fw={700}>
                      {mode === "percent"
                        ? `${percentage}%`
                        : `$${Number(value).toFixed(2)}`}
                    </Text>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>
      ) : (
        <Text size="sm" c="dimmed">
          No category data is available for this period yet.
        </Text>
      )}
    </ChartPanel>
  );
};

export default ContributionChart;
