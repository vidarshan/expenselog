import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IoAddOutline,
  IoInformationCircleSharp,
  IoSearchOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getBudgets } from "../store/slices/budgetsSlice";
import AddBudget from "../components/popups/AddBudget";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet";

const MONTHS = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

function getStatus(spent, limit) {
  if (limit <= 0) return spent > 0 ? "over" : "ok";
  if (spent > limit) return "over";
  if (spent / limit >= 0.85) return "warning";
  return "ok";
}

function getStatusBadge(status) {
  if (status === "over") return <Badge color="red">Over</Badge>;
  if (status === "warning") return <Badge color="yellow">Warning</Badge>;
  return <Badge color="green">OK</Badge>;
}

function getColor(status) {
  if (status === "over") return "red";
  if (status === "warning") return "yellow";
  return "green";
}

function PeriodPicker({ value, onChange }) {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = currentYear - 3; i <= currentYear + 3; i++) {
    years.push({ value: String(i), label: String(i) });
  }

  return (
    <Group gap="sm">
      <Select
        radius="xl"
        data={years}
        value={String(value.year)}
        onChange={(v) => v && onChange({ ...value, year: Number(v) })}
        w={110}
      />
      <Select
        radius="xl"
        data={MONTHS}
        value={String(value.month)}
        onChange={(v) => v && onChange({ ...value, month: Number(v) })}
        w={110}
      />
    </Group>
  );
}

function SummaryCards({ summary }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      {[
        ["Total Budget", `$${summary.totalLimit.toFixed(2)}`],
        ["Budgeted Spent", `$${summary.totalSpentBudgeted.toFixed(2)}`],
        ["Total Spent", `$${summary.totalSpentAll.toFixed(2)}`],
        ["Over Budget", String(summary.overBudgetCount)],
      ].map(([label, value]) => (
        <Paper key={label} withBorder p="md" radius="xl">
          <Text size="xs" c="dimmed">
            {label}
          </Text>
          <Text fw={700} size="xl" mt={4}>
            {value}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  );
}

function BudgetedList({
  items,
  search,
  filter,
  onEdit,
  year,
  month,
  budgetedCount,
}) {
  const q = search.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const matchesSearch = q
      ? item.categoryName.toLowerCase().includes(q)
      : true;

    if (!matchesSearch) return false;

    const status = getStatus(item.spent, item.limit);
    if (filter !== "all" && status !== filter) return false;

    return item.categoryName !== "Unknown";
  });

  return (
    <Paper withBorder radius="1.5rem" p="md">
      <Group align="center" justify="space-between" mb="md">
        <Box>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed">
            Budgeted categories
          </Text>
          <Title order={4}>Tracked categories</Title>
        </Box>
        <Badge size="md" variant="light">
          {budgetedCount} shown
        </Badge>
      </Group>

      <Grid>
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const status = getStatus(item.spent, item.limit);
            const remaining = item.limit - item.spent;
            const percent =
              item.limit > 0 ? (item.spent / item.limit) * 100 : 0;

            return (
              <Grid.Col key={item.categoryId} span={{ base: 12, sm: 6, lg: 4 }}>
                <Paper
                  withBorder
                  radius="xl"
                  p="md"
                  h="100%"
                  onClick={() =>
                    onEdit({
                      year,
                      month,
                      categoryId: item.categoryId
                        ? String(item.categoryId)
                        : "",
                      categoryName: item.categoryName,
                      limit: item.limit,
                    })
                  }
                >
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Box>
                        <Text fw={700}>{item.categoryName}</Text>
                        <Text size="sm" c="dimmed">
                          ${item.spent.toFixed(2)} spent of $
                          {item.limit.toFixed(2)}
                        </Text>
                      </Box>
                      {getStatusBadge(status)}
                    </Group>

                    <Progress
                      size="sm"
                      color={getColor(status)}
                      value={Math.min(percent, 100)}
                      radius="xl"
                    />

                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        {percent.toFixed(0)}% used
                      </Text>
                      <Text size="sm" c={remaining < 0 ? "red" : "dimmed"}>
                        {remaining < 0 ? "Over by" : "Remaining"}: $
                        {Math.abs(remaining).toFixed(2)}
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              </Grid.Col>
            );
          })
        ) : (
          <Grid.Col span={12}>
            <Text c="dimmed">No budgeted categories found.</Text>
          </Grid.Col>
        )}
      </Grid>
    </Paper>
  );
}

function UnbudgetedTable({ items, search }) {
  const rows = [];
  const q = search.trim().toLowerCase();

  for (const item of items) {
    const matchesSearch = q
      ? item.categoryName.toLowerCase().includes(q)
      : true;

    if (!matchesSearch) continue;

    rows.push(
      <Table.Tr key={item.categoryId}>
        <Table.Td>{item.categoryName}</Table.Td>
        <Table.Td>${item.spent.toFixed(2)}</Table.Td>
      </Table.Tr>,
    );
  }

  return (
    <Paper withBorder radius="1.5rem" p="md">
      <Title order={4} mb="sm">
        Unbudgeted Spending
      </Title>

      <ScrollArea>
        <Table highlightOnHover verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Category</Table.Th>
              <Table.Th>Spent</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Text c="dimmed">No unbudgeted spending found.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}

export default function BudgetsPage() {
  const dispatch = useDispatch();
  const { budgets, loading } = useSelector((state) => state.budgets);

  const [opened, setOpened] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedBudget, setSelectedBudget] = useState(null);

  const now = new Date();
  const [period, setPeriod] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(
      getBudgets({
        year: period.year,
        month: period.month,
      }),
    );
  }, [dispatch, period.year, period.month]);

  const items = budgets?.items || [];
  const unbudgeted = budgets?.unbudgeted || [];
  const summary = budgets?.summary || {
    totalLimit: 0,
    totalSpentBudgeted: 0,
    totalSpentAll: 0,
    overBudgetCount: 0,
  };

  const monthLabel =
    MONTHS.find((m) => Number(m.value) === period.month)?.label || period.month;

  const openCreate = () => {
    setMode("create");
    setSelectedBudget(null);
    setOpened(true);
  };

  const openEdit = (budget) => {
    setMode("edit");
    setSelectedBudget(budget);
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
    setMode("create");
    setSelectedBudget(null);
  };

  return (
    <Container size="xl" py="md">
      <Helmet>
        <title>Budgets | ExpenseLog</title>
      </Helmet>
      <AddBudget
        opened={opened}
        setOpened={setOpened}
        mode={mode}
        budget={selectedBudget}
        onClose={handleClose}
      />

      <Stack gap="lg">
        <Paper
          withBorder
          radius="1.75rem"
          p="lg"
          style={{
            background:
              "linear-gradient(160deg, rgba(244, 114, 182, 0.12), rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01))",
          }}
        >
          <Group justify="space-between" align="center">
            <Box>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Budget planning
              </Text>
              <Title order={2}>Budgets</Title>
              <Text size="sm" c="dimmed" mt={4}>
                Track spending and limits for {monthLabel} {period.year}.
              </Text>
            </Box>

            <Button
              leftSection={<IoAddOutline />}
              radius="xl"
              size="md"
              onClick={openCreate}
            >
              Create Budget
            </Button>
          </Group>
        </Paper>

        {loading ? (
          <Loading title="Loading Budgets" />
        ) : (
          <>
            <SummaryCards summary={summary} />
            <Paper withBorder radius="1.5rem" p="md">
              <Group justify="space-between" align="end" wrap="wrap">
                <Box>
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                    Controls
                  </Text>
                  <Text fw={700}>Refine the current budget view</Text>
                  <Alert title="How budgets work" radius="md" color="gray">
                    Set a monthly limit for each category. Budgeted categories
                    show live usage and status updates automatically. Spending
                    without a category budget remains visible under unbudgeted
                    spending.
                  </Alert>
                </Box>
                <Flex gap="xs" wrap="wrap">
                  <PeriodPicker value={period} onChange={setPeriod} />
                  <TextInput
                    radius="xl"
                    placeholder="Search category"
                    leftSection={<IoSearchOutline />}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    w={240}
                  />
                  <Select
                    radius="xl"
                    value={filter}
                    onChange={(v) => setFilter(v || "all")}
                    data={[
                      { value: "all", label: "All" },
                      { value: "warning", label: "Warning" },
                      { value: "over", label: "Over" },
                    ]}
                    w={150}
                  />
                </Flex>
              </Group>
            </Paper>

            <BudgetedList
              items={items}
              search={search}
              filter={filter}
              onEdit={openEdit}
              year={period.year}
              month={period.month}
              budgetedCount={items.length}
            />

            <UnbudgetedTable items={unbudgeted} search={search} />
          </>
        )}
      </Stack>
    </Container>
  );
}
