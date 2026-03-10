import {
  Badge,
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Select,
  Text,
  Title,
} from "@mantine/core";
import { IoCalendarOutline } from "react-icons/io5";
import ContributionChart from "../components/charts/ContributionChart";
import OverviewCard from "../components/OverviewCard";
import ComparisonChart from "../components/charts/ComparisonChart";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComparisons, getDashboard } from "../store/slices/dashboardSlice";
import Loading from "../components/Loading";
import { getActivePeriods } from "../store/slices/logSlice";
import { AIInsightsCard } from "../components/cards/AICard";
import { getMonthOptions, getYearOptions } from "../utils/getCurrentPeriod";
import { setMonth, setYear } from "../store/slices/appSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();

  const { dashboard, monthlyComparison, loading } = useSelector(
    (state) => state.dashboard,
  );
  const { currentYear, currentMonth } = useSelector((state) => state.app);
  const { logs } = useSelector((state) => state.logs);
  console.log(logs);

  useEffect(() => {
    dispatch(getDashboard({ year: currentYear, month: currentMonth }));
    dispatch(
      getComparisons({
        yearA: currentYear,
        monthA: currentMonth - 1,
        yearB: currentYear,
        monthB: currentMonth,
      }),
    );
    dispatch(getActivePeriods());
  }, [currentMonth, currentYear, dispatch]);

  return (
    <Container size="lg" py="md">
      {loading ? (
        <Loading title="Loading Dashboard" />
      ) : (
        <Grid>
          <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Group my="sm" align="center" justify="space-between">
              <Group justify="space-between" align="flex-end">
                <Box>
                  <Title order={2}>Dashboard</Title>
                  <Text c="dimmed" size="sm">
                    Overview for current month
                  </Text>
                </Box>
              </Group>
              <Flex gap="sm">
                <Select
                  radius="md"
                  value={currentMonth}
                  leftSection={<IoCalendarOutline />}
                  placeholder="Select Month"
                  onChange={(value) => dispatch(setMonth(value))}
                  data={getMonthOptions()}
                  allowDeselect={false}
                />
                <Select
                  radius="md"
                  value={currentYear}
                  leftSection={<IoCalendarOutline />}
                  placeholder="Select Year"
                  onChange={(value) => dispatch(setYear(value))}
                  data={getYearOptions()}
                  allowDeselect={false}
                />
              </Flex>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <OverviewCard summary={dashboard?.summary} unit="month" />
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <AIInsightsCard
              insights={[
                "Your expense jump likely came from 1–2 categories—check Food vs last month.",
                "Your spend is concentrated, so savings growth will come from optimizing the remaining flexible 30%.",
              ]}
              actions={[
                "Try a 7-day discretionary cap and track it daily.",
                "Pick 3 repeat merchants and set a weekly limit.",
              ]}
              risks={[
                { label: "High essentials ratio", severity: "medium" },
                { label: "Income flat", severity: "low" },
              ]}
            />
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <ContributionChart
              categoryBreakdown={dashboard?.categoryBreakdown}
            />
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card h="100%" shadow="xl" withBorder>
              <Flex>
                <Text fw={700}>Most Recent transactions</Text>
              </Flex>
              {dashboard?.recentTransactions?.map((tx) => {
                return (
                  <Card
                    key={tx._id}
                    mt="xs"
                    radius="lg"
                    style={{ cursor: "pointer" }}
                    withBorder
                  >
                    <Flex align="center" justify="space-between">
                      <Flex align="center">
                        <Text fw={600} size="sm">
                          {tx.name}
                        </Text>
                        <Badge ml="xs" variant="light">
                          {tx.categoryName}
                        </Badge>
                      </Flex>
                      <Text></Text>
                      <Text fw={600} size="sm">
                        ${tx.amount} | {moment(tx.date).fromNow()}
                      </Text>
                    </Flex>
                  </Card>
                );
              })}
            </Card>
          </Grid.Col>
          <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <ComparisonChart monthlyComparison={monthlyComparison} />
          </Grid.Col>
          {/* <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Card h="100%" withBorder>
              <Flex mb="xl" justify="space-between" align="center">
                <Text fw={700}>Past months</Text>
                <Flex gap="xs">
                  <Select
                    value={year}
                    onChange={setYear}
                    leftSection={<IoCalendarClearOutline />}
                    data={["2025", "2024", "2023", "2022"]}
                  />
                  <Select
                    leftSection={<IoFilterOutline />}
                    placeholder="Apply Filters"
                    data={[
                      "Most Recent",
                      "Most Gain",
                      "Most Loss",
                      "Break Even",
                    ]}
                  />
                </Flex>
              </Flex>
              <Grid>
                <YearAndMonthly rows={rows} />
              </Grid>
              <Flex justify="center">
                <Pagination mt="md" total={10} />
              </Flex>
            </Card>
          </Grid.Col> */}
          {/* <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Card h="100%" withBorder>
              <Flex mb="xl" justify="space-between" align="center">
                <Text fw={700}>Yearly</Text>
                <Flex gap="xs">
                  <Select
                    value={year}
                    onChange={setYear}
                    leftSection={<IoCalendarClearOutline />}
                    data={["2025", "2024", "2023", "2022"]}
                  />
                  <Select
                    leftSection={<IoFilterOutline />}
                    placeholder="Apply Filters"
                    data={[
                      "Most Recent",
                      "Most Gain",
                      "Most Loss",
                      "Break Even",
                    ]}
                  />
                </Flex>
              </Flex>
              <YearAndMonthly mode="year" rows={yearRows} />
              <Flex justify="center">
                <Pagination mt="md" total={3} />
              </Flex>
            </Card>
          </Grid.Col> */}
        </Grid>
      )}
    </Container>
  );
};

export default DashboardPage;
