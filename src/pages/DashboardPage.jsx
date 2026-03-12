import {
  Badge,
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Progress,
  Select,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IoCalendarOutline } from "react-icons/io5";
import ContributionChart from "../components/charts/ContributionChart";
import OverviewCard from "../components/OverviewCard";
import ComparisonChart from "../components/charts/ComparisonChart";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComparisons, getDashboard } from "../store/slices/dashboardSlice";
import Loading from "../components/Loading";
import { getActivePeriods } from "../store/slices/logSlice";
import { AIInsightsCard } from "../components/cards/AICard";
import { getMonthOptions, getYearOptions } from "../utils/getCurrentPeriod";
import { setMonth, setYear } from "../store/slices/appSlice";
import AddRecord from "../components/popups/AddRecord";
import GettingStartedCard from "../components/cards/GettingStartedCard";
import { getTransactions } from "../store/slices/transactionsSlice";
import BudgetsChart from "../components/charts/BudgetsChart";
import ActivityChart from "../components/charts/ActivityChart";
import { getInsights } from "../store/slices/insightsSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();

  const { dashboard, monthlyComparison, loading } = useSelector(
    (state) => state.dashboard,
  );
  const { categories, categoriesLoading } = useSelector(
    (state) => state.categories,
  );
  const { accounts, accountsLoading } = useSelector((state) => state.accounts);
  const { currentYear, currentMonth } = useSelector((state) => state.app);
  const { activePeriods, logsLoading } = useSelector((state) => state.logs);
  const { insights, loading: insightLoading } = useSelector(
    (state) => state.insights,
  );

  const authUser = useSelector((state) => state.auth.user);
  const token = authUser?.token || null;
  const [opened, setOpened] = useState(false);

  const isAuthed = !!token;
  const accountsCount = accounts?.length || 0;
  const categoriesCount = categories?.length || 0;
  const hasTransactions = (dashboard?.recentTransactions?.length || 0) > 0;

  const now = new Date();
  const isCurrentMonthAndYear =
    Number(currentYear) === now.getFullYear() &&
    Number(currentMonth) === now.getMonth() + 1;
  const showSetup =
    isCurrentMonthAndYear &&
    (accountsCount === 0 || categoriesCount === 0 || !hasTransactions);
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
    dispatch(
      getTransactions({
        year: currentYear,
        month: currentMonth,
      }),
    );
    dispatch(getInsights({ year: currentYear, month: currentMonth }));
  }, [currentMonth, currentYear, dispatch]);

  return (
    <Container size="xl" py="md">
      {isAuthed && (
        <AddRecord expenseOpened={opened} setExpenseOpened={setOpened} />
      )}
      {loading || categoriesLoading || accountsLoading || logsLoading ? (
        <Loading title="Loading Dashboard" />
      ) : (
        <>
          {showSetup ? (
            <GettingStartedCard
              accountsCount={accountsCount}
              categoriesCount={categoriesCount}
              hasTransactions={hasTransactions}
              setOpened={setOpened}
            />
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
                      radius="lg"
                      value={currentMonth}
                      leftSection={<IoCalendarOutline />}
                      placeholder="Select Month"
                      onChange={(value) => dispatch(setMonth(value))}
                      data={getMonthOptions(activePeriods, currentYear)}
                      allowDeselect={false}
                    />
                    <Select
                      radius="lg"
                      value={currentYear}
                      leftSection={<IoCalendarOutline />}
                      placeholder="Select Year"
                      onChange={(value) => dispatch(setYear(value))}
                      data={getYearOptions(activePeriods)}
                      allowDeselect={false}
                    />
                  </Flex>
                </Group>
              </Grid.Col>
              <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <OverviewCard summary={dashboard?.summary} unit="month" />
              </Grid.Col>
              <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <AIInsightsCard content={insights} loading={insightLoading} />
              </Grid.Col>
              <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <BudgetsChart summary={dashboard?.budgets?.summary} />
              </Grid.Col>

              <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                <ContributionChart
                  categoryBreakdown={dashboard?.categoryBreakdown}
                />
              </Grid.Col>

              <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                <Card h="100%" shadow="xl" withBorder>
                  <Flex mb="sm">
                    <Text fw={700}>Most Recent transactions</Text>
                  </Flex>
                  {dashboard?.recentTransactions?.map((tx) => (
                    <Flex
                      key={tx._id}
                      justify="space-between"
                      align="center"
                      py="md"
                    >
                      <Flex align="center" gap="xs">
                        <Text size="sm" fw={600}>
                          {tx.name}
                        </Text>
                        {tx.categoryName !== "" && (
                          <Badge
                            size="xs"
                            variant="dot"
                            color={tx.categoryColor}
                          >
                            {tx.categoryName}
                          </Badge>
                        )}
                      </Flex>

                      <Flex align="center" gap="sm">
                        <Text size="xs" c="dimmed">
                          {moment(tx.date).format("MMM D")}
                        </Text>

                        <Text size="sm" fw={600}>
                          ${Number(tx.amount).toFixed(2)}
                        </Text>
                      </Flex>
                    </Flex>
                  ))}
                </Card>
              </Grid.Col>
              <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <ActivityChart />
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
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
