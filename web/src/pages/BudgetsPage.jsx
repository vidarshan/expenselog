import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getBudgets } from "../store/slices/budgetsSlice";

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

function SummaryCards({ summary, budgetedCount }) {
  return (
    <Group grow>
      <Paper h="100%" withBorder p="sm" radius="md">
        <Text size="xs" c="dimmed">
          Total Budget
        </Text>
        <Text fw={700}>${summary.totalLimit.toFixed(2)}</Text>
        <Text size="xs" c="dimmed">
          Categories: {budgetedCount}
        </Text>
      </Paper>

      <Paper h="100%" withBorder p="sm" radius="md">
        <Text size="xs" c="dimmed">
          Budgeted Spent
        </Text>
        <Text fw={700}>${summary.totalSpentBudgeted.toFixed(2)}</Text>
      </Paper>

      <Paper withBorder p="sm" radius="md">
        <Text size="xs" c="dimmed">
          Total Spent
        </Text>
        <Text fw={700}>${summary.totalSpentAll.toFixed(2)}</Text>
      </Paper>

      <Paper withBorder p="sm" radius="md">
        <Text size="xs" c="dimmed">
          Over Budget
        </Text>
        <Text fw={700}>{summary.overBudgetCount}</Text>
      </Paper>
    </Group>
  );
}

function BudgetedTable({ items, search, filter }) {
  const rows = [];
  const q = search.trim().toLowerCase();

  for (const item of items) {
    const matchesSearch = q
      ? item.categoryName.toLowerCase().includes(q)
      : true;

    if (!matchesSearch) continue;

    const status = getStatus(item.spent, item.limit);

    if (filter !== "all" && status !== filter) continue;

    const remaining = item.limit - item.spent;
    const percent = item.limit > 0 ? (item.spent / item.limit) * 100 : 0;

    rows.push(
      <Table.Tr key={item.categoryId}>
        <Table.Td>{item.categoryName}</Table.Td>
        <Table.Td>${item.limit.toFixed(2)}</Table.Td>
        <Table.Td>${item.spent.toFixed(2)}</Table.Td>
        <Table.Td c={remaining < 0 ? "red" : undefined}>
          ${remaining.toFixed(2)}
        </Table.Td>
        <Table.Td>{percent.toFixed(0)}%</Table.Td>
        <Table.Td>{getStatusBadge(status)}</Table.Td>
      </Table.Tr>,
    );
  }

  return (
    <Card withBorder radius="md" p="md">
      <Title order={4} mb="sm">
        Budgeted Categories
      </Title>

      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Category</Table.Th>
              <Table.Th>Limit</Table.Th>
              <Table.Th>Spent</Table.Th>
              <Table.Th>Remaining</Table.Th>
              <Table.Th>Used</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text c="dimmed">No budgeted categories found.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
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
    <Card withBorder radius="md" p="md">
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

  if (loading) {
    return (
      <Container py="md">
        <Loader />
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Stack gap="md">
        <Group justify="space-between" align="end">
          <Box>
            <Title order={2}>Budgets</Title>
            <Text size="sm" c="dimmed">
              Track spending for {monthLabel} {period.year}
            </Text>
          </Box>

          <PeriodPicker value={period} onChange={setPeriod} />
        </Group>

        <SummaryCards summary={summary} budgetedCount={items.length} />

        <Divider />

        <Card withBorder radius="md" p="md">
          <Group>
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
          </Group>
        </Card>

        <BudgetedTable items={items} search={search} filter={filter} />

        <UnbudgetedTable items={unbudgeted} search={search} />
      </Stack>
    </Container>
  );
}
