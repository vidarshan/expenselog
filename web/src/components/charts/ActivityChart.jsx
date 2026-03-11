import { Heatmap } from "@mantine/charts";
import { Card, Flex, Group, Select, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import { getYearOptions } from "../../utils/getCurrentPeriod";
import { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { getHeatMap } from "../../store/slices/analyticsSlice";

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

function generateDateRange(startDate, endDate) {
  const result = {};
  const start = new Date(startDate);
  const end = new Date(endDate);

  const current = new Date(start);

  while (current <= end) {
    const key = current.toISOString().split("T")[0];
    result[key] = null; // empty day
    current.setDate(current.getDate() + 1);
  }

  return result;
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
    console.log(data);
    return data.reduce((acc, item) => {
      acc[item.date] = item.total;
      return acc;
    }, {});
  }

  if (loadingAnalytics) {
    return <Loading />;
  }

  return (
    <Card className="hover" h="100%" shadow="xl" withBorder>
      <Group justify="space-between">
        <Text fw={700}>
          {startDate} to {endDate}
        </Text>
        <Select
          radius="lg"
          size="xs"
          value={year}
          leftSection={<IoCalendarOutline />}
          placeholder="Select Year"
          onChange={(value) => setYear(value)}
          data={getYearOptions(activePeriods)}
          allowDeselect={false}
        />
      </Group>

      <Flex justify="center">
        <Heatmap
          mt="md"
          startDate={startDate}
          endDate={endDate}
          overflow="scroll"
          withMonthLabels
          rectRadius={20}
          gap={4}
          withWeekdayLabels
          withTooltip
          getTooltipLabel={({ date, value }) =>
            `${date} – $${value ?? 0} spent`
          }
          data={formatHeatmapData(heatmap)}
        />
      </Flex>
    </Card>
  );
};

export default ActivityChart;
