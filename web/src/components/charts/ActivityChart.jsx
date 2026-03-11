import { Heatmap } from "@mantine/charts";
import { Card, Flex, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import Loading from "../Loading";

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
  const { transactions, loading } = useSelector((state) => state.transactions);

  const { startDate, endDate } = getPastYearRange();
  const baseRange = generateDateRange(startDate, endDate);

  const heatmapData = (transactions?.data || []).reduce((acc, tx) => {
    const day = formatDate(new Date(tx.date));

    if (acc[day] !== undefined) {
      acc[day] += tx.amount;
    }

    return acc;
  }, baseRange);

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="hover" h="100%" shadow="xl" withBorder>
      <Text fw={700}>Activity in the past year</Text>

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
          data={heatmapData}
        />
      </Flex>
    </Card>
  );
};

export default ActivityChart;
