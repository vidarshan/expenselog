import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
} from "react-icons/io5";
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
import { Helmet } from "react-helmet";
import { getAccounts } from "../store/slices/accountsSlice";
import { getCategories } from "../store/slices/categorySlice";

const DashboardPage = () => {
  const dispatch = useDispatch();

  const { dashboard, monthlyComparison, loading } = useSelector(
    (state) => state.dashboard,
  );
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories,
  );
  const { accounts, loading: accountsLoading } = useSelector(
    (state) => state.accounts,
  );
  const { currentYear, currentMonth } = useSelector((state) => state.app);
  const { activePeriods, loading: logsLoading } = useSelector(
    (state) => state.logs,
  );
  const { insights, loading: insightLoading } = useSelector(
    (state) => state.insights,
  );

  const authUser = useSelector((state) => state.auth.user);
  const token = authUser?.token || null;
  const [opened, setOpened] = useState(false);
  const [setupReady, setSetupReady] = useState(false);

  const isAuthed = !!token;
  const accountsCount = accounts?.length || 0;
  const categoriesCount = categories?.length || 0;
  const hasTransactions = (dashboard?.recentTransactions?.length || 0) > 0;

  const now = new Date();
  const isCurrentMonthAndYear =
    Number(currentYear) === now.getFullYear() &&
    Number(currentMonth) === now.getMonth() + 1;
  const showSetup =
    setupReady &&
    isCurrentMonthAndYear &&
    (accountsCount === 0 || categoriesCount === 0 || !hasTransactions);

  useEffect(() => {
    let cancelled = false;
    const currentMonthNumber = Number(currentMonth);
    const currentYearNumber = Number(currentYear);
    const previousMonth = currentMonthNumber === 1 ? 12 : currentMonthNumber - 1;
    const previousYear =
      currentMonthNumber === 1 ? currentYearNumber - 1 : currentYearNumber;

    Promise.allSettled([
      dispatch(getDashboard({ year: currentYear, month: currentMonth })),
      dispatch(
        getComparisons({
          yearA: previousYear,
          monthA: previousMonth,
          yearB: currentYearNumber,
          monthB: currentMonthNumber,
        }),
      ),
      dispatch(getActivePeriods()),
      dispatch(
        getTransactions({
          year: currentYear,
          month: currentMonth,
        }),
      ),
      dispatch(getInsights({ year: currentYear, month: currentMonth })),
      dispatch(getAccounts()),
      dispatch(getCategories()),
    ]).finally(() => {
      if (!cancelled) {
        setSetupReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [currentMonth, currentYear, dispatch]);

  return (
    <Container size="xl" py="md">
      <Helmet>
        <title>Dashboard | ExpenseLog</title>
      </Helmet>
      {isAuthed && (
        <AddRecord expenseOpened={opened} setExpenseOpened={setOpened} />
      )}
      {!setupReady || loading || categoriesLoading || accountsLoading || logsLoading ? (
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

              <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 12 }}>
                <ContributionChart
                  categoryBreakdown={dashboard?.categoryBreakdown}
                />
              </Grid.Col>

              <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 12 }}>
                <Paper
                  h="100%"
                  withBorder
                  radius="1.5rem"
                  p="md"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 42%, rgba(255,255,255,0.01))",
                  }}
                >
                  <Stack h="100%" gap="md">
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Group gap="sm" align="flex-start" wrap="nowrap">
                        <Paper
                          withBorder
                          radius="xl"
                          p="xs"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          <IoDocumentTextOutline size={18} />
                        </Paper>
                        <Box>
                          <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                            Live feed
                          </Text>
                          <Text fw={700} size="lg">
                            Most Recent Transactions
                          </Text>
                          <Text size="sm" c="dimmed">
                            The latest entries recorded for this month.
                          </Text>
                        </Box>
                      </Group>
                      <Badge variant="light">
                        {dashboard?.recentTransactions?.length || 0} shown
                      </Badge>
                    </Group>

                    <Paper withBorder radius="1.25rem" p="md" style={{ flex: 1 }}>
                      {dashboard?.recentTransactions?.length ? (
                        <Stack gap="sm">
                          {dashboard.recentTransactions.map((tx) => (
                            <Paper
                              key={tx._id}
                              withBorder
                              radius="xl"
                              p="sm"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                              }}
                            >
                              <Group justify="space-between" align="center" wrap="nowrap">
                                <Stack gap={2} style={{ minWidth: 0 }}>
                                  <Group gap="xs" wrap="wrap">
                                    <Text size="sm" fw={700}>
                                      {tx.name}
                                    </Text>
                                    {tx.categoryName !== "" && (
                                      <Badge
                                        size="xs"
                                        variant="light"
                                        color={tx.categoryColor}
                                      >
                                        {tx.categoryName}
                                      </Badge>
                                    )}
                                  </Group>
                                  <Group gap={6}>
                                    <IoTimeOutline size={12} />
                                    <Text size="xs" c="dimmed">
                                      {moment(tx.date).format("MMM D")}
                                    </Text>
                                  </Group>
                                </Stack>

                                <Text size="sm" fw={700}>
                                  ${Number(tx.amount).toFixed(2)}
                                </Text>
                              </Group>
                            </Paper>
                          ))}
                        </Stack>
                      ) : (
                        <Text size="sm" c="dimmed">
                          No transactions for this period yet.
                        </Text>
                      )}
                    </Paper>
                  </Stack>
                </Paper>
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
