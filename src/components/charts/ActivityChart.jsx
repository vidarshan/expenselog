import { Heatmap } from "@mantine/charts";
import { Card, Flex, Text } from "@mantine/core";

const ActivityChart = ({ data }) => {
  return (
    <Card className="hover" h="100%" shadow="xl" withBorder>
      <Text fw={700}>Active days in the year</Text>
      <Flex justify="center">
        <Heatmap
          mt="md"
          startDate="2024-01-01"
          overflow="scroll"
          endDate="2024-12-31"
          withMonthLabels
          rectRadius={20}
          gap={4}
          withWeekdayLabels
          withTooltip
          getTooltipLabel={({ date, value }) =>
            `${date} – ${value ?? 0} contributions`
          }
          data={data}
        />
      </Flex>
    </Card>
  );
};

export default ActivityChart;
