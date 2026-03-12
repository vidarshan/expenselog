import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Paper,
  Progress,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IoAddOutline,
  IoInformationCircleSharp,
  IoPencilOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getBudgets } from "../store/slices/budgetsSlice";
import AddBudget from "../components/popups/AddBudget";
import Loading from "../components/Loading";

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
        data={years}
        value={String(value.year)}
        onChange={(v) => v && onChange({ ...value, year: Number(v) })}
        w={100}
      />
      <Select
        data={MONTHS}
        value={String(value.month)}
        onChange={(v) => v && onChange({ ...value, month: Number(v) })}
        w={100}
      />
    </Group>
  );
}

function SummaryCards({ summary }) {
  return (
    <Group grow>
      <Paper h="100%" withBorder p="sm" radius="lg">
        <Text size="xs" c="dimmed">
          Total Budget
        </Text>
        <Text fw={700}>${summary.totalLimit.toFixed(2)}</Text>
      </Paper>

      <Paper h="100%" withBorder p="sm" radius="lg">
        <Text size="xs" c="dimmed">
          Budgeted Spent
        </Text>
        <Text fw={700}>${summary.totalSpentBudgeted.toFixed(2)}</Text>
      </Paper>

      <Paper withBorder p="sm" radius="lg">
        <Text size="xs" c="dimmed">
          Total Spent
        </Text>
        <Text fw={700}>${summary.totalSpentAll.toFixed(2)}</Text>
      </Paper>

      <Paper withBorder p="sm" radius="lg">
        <Text size="xs" c="dimmed">
          Over Budget
        </Text>
        <Text fw={700}>{summary.overBudgetCount}</Text>
      </Paper>
    </Group>
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
    <Card withBorder radius="lg" p="md">
      <Group align="center" mb="md">
        <Title order={4}>Budgeted Categories</Title>
        <Badge size="lg">{budgetedCount}</Badge>
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
                  radius="lg"
                  p="md"
                  style={{ cursor: "pointer", height: "100%" }}
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
                  <Group justify="space-between" align="flex-start" mb="xs">
                    <Box>
                      <Text fw={700}>{item.categoryName}</Text>
                      <Text size="sm" c="dimmed">
                        ${item.spent.toFixed(2)} spent of $
                        {item.limit.toFixed(2)}
                      </Text>
                    </Box>

                    <Group gap="xs">{getStatusBadge(status)}</Group>
                  </Group>

                  <Progress
                    size="sm"
                    color={getColor(status)}
                    value={Math.min(percent, 100)}
                    radius="xl"
                  />

                  <Group justify="space-between" mt="xs">
                    <Text size="sm" c="dimmed">
                      {percent.toFixed(0)}% used
                    </Text>
                    <Text size="sm" c={remaining < 0 ? "red" : "dimmed"}>
                      {remaining < 0 ? "Over by" : "Remaining"}: $
                      {Math.abs(remaining).toFixed(2)}
                    </Text>
                  </Group>
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
    </Card>
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
    <Card withBorder radius="lg" p="md">
      <Title order={4} mb="sm">
        Unbudgeted Spending
      </Title>

      <ScrollArea>
        <Table striped highlightOnHover>
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
    </Card>
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
      <AddBudget
        opened={opened}
        setOpened={setOpened}
        mode={mode}
        budget={selectedBudget}
        onClose={handleClose}
      />

      <Stack gap="md">
        <Group justify="space-between" align="end">
          <Box>
            <Title order={2}>Budgets</Title>
            <Text size="sm" c="dimmed">
              Track spending for {monthLabel} {period.year}
            </Text>
          </Box>

          <Group>
            <Button leftSection={<IoAddOutline />} onClick={openCreate}>
              Create
            </Button>
          </Group>
        </Group>
        {loading ? (
          <Loading title="Loading Budgets" />
        ) : (
          <>
            <SummaryCards summary={summary} />

            <Divider />
            <Alert
              icon={<IoInformationCircleSharp />}
              title="How budgets work?"
              radius="lg"
              color="gray"
            >
              Set a monthly spending limit for each category. Spending in
              categories with a budget will appear under Budgeted Categories.
              Spending in categories without a budget will appear under
              Unbudgeted Spending. Status updates automatically as you approach
              or exceed your limit.
            </Alert>

            <Group justify="space-between">
              <PeriodPicker value={period} onChange={setPeriod} />
              <Flex gap="xs">
                <TextInput
                  placeholder="Search category"
                  leftSection={<IoSearchOutline />}
                  value={search}
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  w={250}
                />

                <Select
                  value={filter}
                  onChange={(v) => setFilter(v || "all")}
                  data={[
                    { value: "all", label: "All" },
                    { value: "warning", label: "Warning" },
                    { value: "over", label: "Over" },
                  ]}
                  w={160}
                />
              </Flex>
            </Group>
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
