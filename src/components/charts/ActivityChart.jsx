import { Heatmap } from "@mantine/charts";
import { Box, Flex, Group, Paper, Select, Stack, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import { getYearOptions } from "../../utils/getCurrentPeriod";
import { useEffect, useState } from "react";
import { IoCalendarOutline, IoPulseOutline } from "react-icons/io5";
import { getHeatMap } from "../../store/slices/analyticsSlice";
import ChartPanel from "./ChartPanel";

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getPastYearRange() {
  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  start.setDate(start.getDate() + 1);

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

const ActivityChart = () => {
  const dispatch = useDispatch();

  const { heatmap, loadingAnalytics } = useSelector((state) => state.analytics);
  const { activePeriods } = useSelector((state) => state.logs);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const { startDate, endDate } = getPastYearRange();

  useEffect(() => {
    dispatch(getHeatMap(year));
  }, [dispatch, year]);

  function formatHeatmapData(data) {
    return data.reduce((acc, item) => {
      acc[item.date] = item.total;
      return acc;
    }, {});
  }

  if (loadingAnalytics) {
    return <Loading />;
  }

  return (
    <ChartPanel
      icon={<IoPulseOutline size={20} />}
      title="Spending Activity"
      eyebrow="Past 12 months"
      accent="blue"
      description="A compact view of how active your spending has been over time, with darker days signaling heavier activity."
      action={
        <Select
          radius="xl"
          size="xs"
          value={year}
          leftSection={<IoCalendarOutline />}
          placeholder="Select year"
          onChange={setYear}
          data={getYearOptions(activePeriods)}
          allowDeselect={false}
        />
      }
    >
      <Stack gap="md">
        <Group gap="xs">
          <Paper withBorder radius="lg" p="xs">
            <Text size="xs" c="dimmed">
              Range
            </Text>
            <Text size="sm" fw={700}>
              {year}
            </Text>
          </Paper>
          <Paper withBorder radius="lg" p="xs">
            <Text size="xs" c="dimmed">
              Days with data
            </Text>
            <Text size="sm" fw={700}>
              {heatmap?.length || 0}
            </Text>
          </Paper>
        </Group>

        <Flex justify="center" style={{ overflowX: "auto" }}>
          <Heatmap
            mt="md"
            startDate={startDate}
            endDate={endDate}
            overflow="scroll"
            withMonthLabels
            rectRadius={8}
            gap={5}
            withWeekdayLabels
            withTooltip
            getTooltipLabel={({ date, value }) =>
              `${date} - $${value?.toFixed(2) ?? 0} spent`
            }
            data={formatHeatmapData(heatmap)}
          />
        </Flex>
      </Stack>
    </ChartPanel>
  );
};

export default ActivityChart;
