import { useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import { IoCalendarOutline, IoSparklesOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AIInsightsCard } from "../components/cards/AICard";
import { getActivePeriods } from "../store/slices/logSlice";
import { getInsights } from "../store/slices/insightsSlice";
import { setMonth, setYear } from "../store/slices/appSlice";
import { getMonthOptions, getYearOptions } from "../utils/getCurrentPeriod";

const InsightsPage = () => {
  const dispatch = useDispatch();
  const { currentYear, currentMonth } = useSelector((state) => state.app);
  const { activePeriods } = useSelector((state) => state.logs);
  const { insights, loading, error } = useSelector((state) => state.insights);

  useEffect(() => {
    dispatch(getActivePeriods());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getInsights({ year: currentYear, month: currentMonth }));
  }, [currentMonth, currentYear, dispatch]);

  return (
    <Container size="xl" py="md">
      <Helmet>
        <title>Insights | ExpenseLog</title>
      </Helmet>

      <Grid>
        <Grid.Col span={12}>
          <Group justify="space-between" align="end">
            <Box>
              <Title order={2}>Insights</Title>
              <Text size="sm" c="dimmed">
                Review personalized observations and next steps for this period.
              </Text>
            </Box>

            <Flex gap="sm" wrap="wrap">
              <Select
                radius="lg"
                value={currentMonth}
                leftSection={<IoCalendarOutline />}
                placeholder="Month"
                data={getMonthOptions(activePeriods, currentYear)}
                allowDeselect={false}
                onChange={(value) => value && dispatch(setMonth(value))}
              />
              <Select
                radius="lg"
                value={currentYear}
                leftSection={<IoCalendarOutline />}
                placeholder="Year"
                data={getYearOptions(activePeriods)}
                allowDeselect={false}
                onChange={(value) => value && dispatch(setYear(value))}
              />
            </Flex>
          </Group>
        </Grid.Col>

        <Grid.Col span={12}>
          {error ? (
            <Paper withBorder radius="lg" p="lg">
              <Group gap="sm" mb="xs">
                <IoSparklesOutline />
                <Text fw={700}>Insights unavailable</Text>
              </Group>
              <Text size="sm" c="dimmed">
                {error}
              </Text>
            </Paper>
          ) : (
            <AIInsightsCard
              title={`AI Insights for ${currentMonth}/${currentYear}`}
              content={insights}
              loading={loading}
            />
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default InsightsPage;
