import {
  Badge,
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  Select,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IoArrowDown,
  IoArrowUp,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
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
import DownloadReport from "../components/popups/DownloadReport";
import GettingStartedCard from "../components/cards/GettingStartedCard";
import { getTransactions } from "../store/slices/transactionsSlice";
import BudgetsChart from "../components/charts/BudgetsChart";
import ActivityChart from "../components/charts/ActivityChart";
import { getInsights } from "../store/slices/insightsSlice";
import { Helmet } from "react-helmet";
import { getAccounts } from "../store/slices/accountsSlice";
import { getCategories } from "../store/slices/categorySlice";
import api from "../api/axios";

const EMPTY_DASHBOARD = {
  meta: {
    year: new Date().getFullYear(),
    month: null,
    logId: "",
  },
  summary: {
    income: 0,
    expenses: 0,
    net: 0,
    savingsRate: 0,
    txCount: 0,
  },
  categoryBreakdown: [],
  recentTransactions: [],
  comparison: {
    lastMonth: {
      year: new Date().getFullYear(),
      month: 1,
    },
    incomeDiff: 0,
    expensesDiff: 0,
    netDiff: 0,
  },
  budgets: {
    summary: {
      totalLimit: 0,
      totalSpentBudgeted: 0,
      totalSpent: 0,
    },
  },
};

function aggregateYearDashboard(monthlyDashboards = [], year) {
  if (!monthlyDashboards.length) {
    return {
      ...EMPTY_DASHBOARD,
      meta: {
        ...EMPTY_DASHBOARD.meta,
        year,
      },
    };
  }

  const summary = monthlyDashboards.reduce(
    (acc, item) => {
      acc.income += Number(item.summary?.income || 0);
      acc.expenses += Number(item.summary?.expenses || 0);
      acc.txCount += Number(item.summary?.txCount || 0);
      return acc;
    },
    { income: 0, expenses: 0, txCount: 0 },
  );

  summary.net = summary.income - summary.expenses;
  summary.savingsRate =
    summary.income > 0
      ? Number(
          (
            ((summary.income - summary.expenses) / summary.income) *
            100
          ).toFixed(1),
        )
      : 0;

  const categoryMap = monthlyDashboards.reduce((acc, item) => {
    for (const category of item.categoryBreakdown || []) {
      const key = category.categoryName;

      if (!acc[key]) {
        acc[key] = {
          categoryName: category.categoryName,
          color: category.color,
          total: 0,
        };
      }

      acc[key].total += Number(category.total || 0);
    }

    return acc;
  }, {});

  const budgetSummary = monthlyDashboards.reduce(
    (acc, item) => {
      const source = item.budgets?.summary || {};
      acc.totalLimit += Number(source.totalLimit || 0);
      acc.totalSpentBudgeted += Number(
        source.totalSpentBudgeted ?? source.totalSpent ?? 0,
      );
      acc.totalSpent += Number(
        source.totalSpent ?? source.totalSpentBudgeted ?? 0,
      );
      return acc;
    },
    { totalLimit: 0, totalSpentBudgeted: 0, totalSpent: 0 },
  );

  const recentTransactions = monthlyDashboards
    .flatMap((item) => item.recentTransactions || [])
    .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
    .slice(0, 12);

  return {
    ...EMPTY_DASHBOARD,
    meta: {
      year,
      month: null,
      logId: "",
    },
    summary,
    categoryBreakdown: Object.values(categoryMap).sort(
      (a, b) => b.total - a.total,
    ),
    recentTransactions,
    budgets: {
      summary: budgetSummary,
    },
  };
}

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
  const [reportOpened, setReportOpened] = useState(false);
  const [setupReady, setSetupReady] = useState(false);
  const [periodMode, setPeriodMode] = useState("monthly");
  const [recentTransactionsCollapsed, setRecentTransactionsCollapsed] =
    useState(false);
  const [yearlyDashboard, setYearlyDashboard] = useState(EMPTY_DASHBOARD);
  const [yearlyLoading, setYearlyLoading] = useState(false);

  const isAuthed = !!token;
  const accountsCount = accounts?.length || 0;
  const categoriesCount = categories?.length || 0;

  const now = new Date();
  const monthOptions = getMonthOptions(activePeriods, currentYear);
  const selectedMonthLabel =
    monthOptions.find((item) => item.value === currentMonth)?.label ||
    moment(`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`).format(
      "MMMM",
    );
  const selectedPeriodLabel =
    periodMode === "yearly"
      ? String(currentYear)
      : `${selectedMonthLabel} ${currentYear}`;
  const displayDashboard =
    periodMode === "yearly" ? yearlyDashboard : dashboard;
  const displayInsights = periodMode === "monthly" ? insights : null;
  const displayInsightLoading =
    periodMode === "monthly" ? insightLoading : false;
  const handleRegenerateInsights = () =>
    dispatch(
      getInsights({
        year: currentYear,
        month: currentMonth,
        forceRefresh: true,
      }),
    );
  const hasTransactions =
    (displayDashboard?.recentTransactions?.length || 0) > 0;
  const hasAnyTransactionHistory = activePeriods.some(
    (period) => (period?.months?.length || 0) > 0,
  );
  const isCurrentMonthAndYear =
    Number(currentYear) === now.getFullYear() &&
    Number(currentMonth) === now.getMonth() + 1;
  const showSetup =
    periodMode === "monthly" &&
    setupReady &&
    isCurrentMonthAndYear &&
    (accountsCount === 0 ||
      categoriesCount === 0 ||
      !hasAnyTransactionHistory);

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      setSetupReady(false);

      const currentMonthNumber = Number(currentMonth);
      const currentYearNumber = Number(currentYear);
      const previousMonth =
        currentMonthNumber === 1 ? 12 : currentMonthNumber - 1;
      const previousYear =
        currentMonthNumber === 1 ? currentYearNumber - 1 : currentYearNumber;

      const activePeriodsPromise = dispatch(getActivePeriods())
        .unwrap()
        .catch(() => []);

      const sharedPromises = [
        dispatch(getAccounts()),
        dispatch(getCategories()),
      ];

      if (periodMode === "monthly") {
        await Promise.allSettled([
          dispatch(getDashboard({ year: currentYear, month: currentMonth })),
          dispatch(
            getComparisons({
              yearA: previousYear,
              monthA: previousMonth,
              yearB: currentYearNumber,
              monthB: currentMonthNumber,
            }),
          ),
          dispatch(
            getTransactions({
              year: currentYear,
              month: currentMonth,
            }),
          ),
          dispatch(getInsights({ year: currentYear, month: currentMonth })),
          activePeriodsPromise,
          ...sharedPromises,
        ]);
      } else {
        setYearlyLoading(true);
        await Promise.allSettled(sharedPromises);

        const periods = await activePeriodsPromise;
        const yearEntry = periods.find((p) => p.year === currentYearNumber);
        const months = [...(yearEntry?.months || [])].sort((a, b) => a - b);

        if (!months.length) {
          if (!cancelled) {
            setYearlyDashboard({
              ...EMPTY_DASHBOARD,
              meta: { ...EMPTY_DASHBOARD.meta, year: currentYearNumber },
            });
          }
        } else {
          const responses = await Promise.all(
            months.map(async (monthValue) => {
              const res = await api.get("/dashboard", {
                params: { year: currentYearNumber, month: monthValue },
              });
              return res.data;
            }),
          );

          if (!cancelled) {
            setYearlyDashboard(
              aggregateYearDashboard(responses, currentYearNumber),
            );
          }
        }

        if (!cancelled) {
          setYearlyLoading(false);
        }
      }

      if (!cancelled) {
        setSetupReady(true);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [currentMonth, currentYear, dispatch, periodMode]);

  return (
    <Container size="xl" py="md">
      <Helmet>
        <title>Dashboard | ExpenseLog</title>
      </Helmet>
      {isAuthed && (
        <AddRecord expenseOpened={opened} setExpenseOpened={setOpened} />
      )}
      <DownloadReport
        opened={reportOpened}
        onClose={() => setReportOpened(false)}
        activePeriods={activePeriods}
        defaultYear={currentYear}
        defaultMonth={currentMonth}
      />
      {!setupReady ||
      (periodMode === "monthly" ? loading : yearlyLoading) ||
      categoriesLoading ||
      accountsLoading ||
      logsLoading ? (
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
            <Grid gutter="xl">
              <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <Paper
                  withBorder
                  radius="1.75rem"
                  p="lg"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(163, 230, 53, 0.12), rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01))",
                  }}
                >
                  <Group justify="space-between" align="flex-end" wrap="wrap">
                    <Box maw={520}>
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                        {periodMode === "yearly"
                          ? "Yearly overview"
                          : "Period overview"}
                      </Text>
                      <Title order={2}>Dashboard</Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        Review spending, budgets, and activity for{" "}
                        {selectedPeriodLabel}.
                      </Text>
                    </Box>

                    <Stack gap="sm" align="flex-end">
                      <SegmentedControl
                        radius="xl"
                        value={periodMode}
                        onChange={setPeriodMode}
                        data={[
                          { label: "Monthly", value: "monthly" },
                          { label: "Yearly", value: "yearly" },
                        ]}
                      />

                      <Group gap="sm" justify="flex-end" wrap="wrap">
                        {periodMode === "monthly" ? (
                          <Select
                            minw={170}
                            radius="xl"
                            value={currentMonth}
                            leftSection={<IoCalendarOutline />}
                            placeholder="Select Month"
                            onChange={(value) => dispatch(setMonth(value))}
                            data={monthOptions}
                            allowDeselect={false}
                          />
                        ) : null}
                        <Select
                          minw={150}
                          radius="xl"
                          value={currentYear}
                          leftSection={<IoCalendarOutline />}
                          placeholder="Select Year"
                          onChange={(value) => dispatch(setYear(value))}
                          data={getYearOptions(activePeriods)}
                          allowDeselect={false}
                        />
                        <Button
                          leftSection={<IoDownloadOutline />}
                          radius="xl"
                          size="sm"
                          variant="light"
                          onClick={() => setReportOpened(true)}
                        >
                          Download
                        </Button>
                      </Group>
                    </Stack>
                  </Group>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <OverviewCard
                  summary={displayDashboard?.summary}
                  periodLabel={selectedPeriodLabel}
                />
              </Grid.Col>
              {periodMode === "monthly" ? (
                <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <AIInsightsCard
                    content={displayInsights}
                    loading={displayInsightLoading}
                    onRegenerate={handleRegenerateInsights}
                  />
                </Grid.Col>
              ) : null}
              <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <BudgetsChart
                  summary={displayDashboard?.budgets?.summary}
                  periodLabel={selectedPeriodLabel}
                />
              </Grid.Col>

              <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 12 }}>
                <ContributionChart
                  categoryBreakdown={displayDashboard?.categoryBreakdown}
                  periodLabel={selectedPeriodLabel}
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
                    <Group
                      justify="space-between"
                      align="flex-start"
                      wrap="nowrap"
                    >
                      <Group gap="sm" align="flex-start" wrap="nowrap">
                        <ThemeIcon
                          size={42}
                          radius="xl"
                          mt={2}
                          color="dark"
                          variant="light"
                        >
                          <IoDocumentTextOutline />
                        </ThemeIcon>

                        <Box>
                          <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                            Feed
                          </Text>
                          <Text fw={700} size="lg">
                            Most Recent Transactions
                          </Text>
                          <Text size="sm" c="dimmed">
                            The latest entries recorded for{" "}
                            {selectedPeriodLabel}.
                          </Text>
                        </Box>
                      </Group>
                      <Group gap="xs">
                        <Badge variant="light">
                          {displayDashboard?.recentTransactions?.length || 0}{" "}
                          shown
                        </Badge>
                        <Button
                          size="xs"
                          radius="xl"
                          variant="subtle"
                          onClick={() =>
                            setRecentTransactionsCollapsed((value) => !value)
                          }
                          leftSection={
                            recentTransactionsCollapsed ? (
                              <IoArrowDown size={14} />
                            ) : (
                              <IoArrowUp size={14} />
                            )
                          }
                          styles={{
                            root: {
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "inherit",
                            },
                          }}
                        >
                          {recentTransactionsCollapsed ? "Expand" : "Collapse"}
                        </Button>
                      </Group>
                    </Group>

                    <Collapse in={!recentTransactionsCollapsed}>
                      <Paper
                        withBorder
                        radius="1.25rem"
                        p="md"
                        style={{ flex: 1 }}
                      >
                        {displayDashboard?.recentTransactions?.length ? (
                          <Stack gap="sm">
                            {displayDashboard.recentTransactions.map((tx) => (
                              <Paper key={tx._id} withBorder radius="lg" p="sm">
                                <Group
                                  justify="space-between"
                                  align="center"
                                  wrap="nowrap"
                                >
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
                    </Collapse>
                  </Stack>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <ActivityChart />
              </Grid.Col>
              {periodMode === "monthly" ? (
                <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <ComparisonChart monthlyComparison={monthlyComparison} />
                </Grid.Col>
              ) : null}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
