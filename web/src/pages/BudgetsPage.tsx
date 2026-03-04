// BudgetsPage.tsx
// Complete Budgets page with MOCK DATA (no API needed yet)
// Stack: React + Mantine
// Drop this into your routes/pages and render <BudgetsPage />

import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Modal,
  NumberInput,
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
  Tooltip,
} from "@mantine/core";
import { IoPencilOutline, IoSearchOutline } from "react-icons/io5";

/** -----------------------------
 * Types
 ------------------------------*/
type Period = { year: number; month: number };

type BudgetItem = {
  categoryId: string;
  categoryName: string;
  limit: number; // budget limit for this category
  spent: number; // total expenses in the period
};

type UnbudgetedItem = {
  categoryId: string;
  categoryName: string;
  spent: number;
};

type BudgetOverview = {
  period: Period;
  items: BudgetItem[];
  unbudgeted: UnbudgetedItem[];
};

/** -----------------------------
 * Mock data helpers
 ------------------------------*/
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

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pctUsed(spent: number, limit: number) {
  if (limit <= 0) return spent > 0 ? 1 : 0;
  return spent / limit;
}

function statusFor(spent: number, limit: number): "ok" | "warning" | "over" {
  if (limit <= 0) return spent > 0 ? "over" : "ok";
  const p = spent / limit;
  if (spent > limit) return "over";
  if (p >= 0.85) return "warning";
  return "ok";
}

function statusBadge(status: "ok" | "warning" | "over") {
  if (status === "over") return <Badge color="red">Over</Badge>;
  if (status === "warning") return <Badge color="yellow">Warning</Badge>;
  return <Badge color="green">OK</Badge>;
}

// Creates predictable mock numbers that vary by month/year
function seededAmount(seed: number, min: number, max: number) {
  // simple deterministic-ish pseudo-random
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return Math.round((min + frac * (max - min)) * 100) / 100;
}

function buildMockOverview(period: Period): BudgetOverview {
  const { year, month } = period;
  const baseSeed = year * 100 + month;

  const budgeted: BudgetItem[] = [
    {
      categoryId: "cat_food",
      categoryName: "Food",
      limit: 500,
      spent: seededAmount(baseSeed + 1, 250, 620),
    },
    {
      categoryId: "cat_transport",
      categoryName: "Transport",
      limit: 180,
      spent: seededAmount(baseSeed + 2, 50, 220),
    },
    {
      categoryId: "cat_rent",
      categoryName: "Rent",
      limit: 1200,
      spent: 1200,
    },
    {
      categoryId: "cat_ent",
      categoryName: "Entertainment",
      limit: 150,
      spent: seededAmount(baseSeed + 3, 20, 240),
    },
    {
      categoryId: "cat_gym",
      categoryName: "Gym",
      limit: 45,
      spent: 45,
    },
    {
      categoryId: "cat_phone",
      categoryName: "Phone",
      limit: 55,
      spent: seededAmount(baseSeed + 4, 45, 65),
    },
  ];

  const unbudgeted: UnbudgetedItem[] = [
    {
      categoryId: "cat_gifts",
      categoryName: "Gifts",
      spent: seededAmount(baseSeed + 5, 10, 120),
    },
    {
      categoryId: "cat_fees",
      categoryName: "Bank Fees",
      spent: seededAmount(baseSeed + 6, 0, 25),
    },
  ].filter((x) => x.spent > 0);

  return { period, items: budgeted, unbudgeted };
}

/** -----------------------------
 * Components
 ------------------------------*/
function PeriodPicker({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }).map((_, i) => {
    const y = currentYear - 3 + i;
    return { value: String(y), label: String(y) };
  });

  return (
    <Group gap="sm">
      <Select
        data={years}
        value={String(value.year)}
        onChange={(v) => v && onChange({ ...value, year: Number(v) })}
        w={120}
      />
      <Select
        data={MONTHS}
        value={String(value.month)}
        onChange={(v) => v && onChange({ ...value, month: Number(v) })}
        w={120}
      />
    </Group>
  );
}

function SummaryCards({ overview }: { overview: BudgetOverview }) {
  const summary = useMemo(() => {
    const totalLimit = overview.items.reduce((s, i) => s + (i.limit || 0), 0);
    const totalSpentBudgeted = overview.items.reduce(
      (s, i) => s + (i.spent || 0),
      0,
    );
    const totalSpentUnbudgeted = overview.unbudgeted.reduce(
      (s, i) => s + (i.spent || 0),
      0,
    );
    const totalSpentAll = totalSpentBudgeted + totalSpentUnbudgeted;
    const overBudgetCount = overview.items.filter(
      (i) => i.spent > i.limit,
    ).length;

    return {
      totalLimit,
      totalSpentBudgeted,
      totalSpentUnbudgeted,
      totalSpentAll,
      overBudgetCount,
    };
  }, [overview]);

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      <Paper withBorder p="md" radius="md">
        <Text size="sm" c="dimmed">
          Total Spent (All)
        </Text>
        <Text fw={700} size="xl">
          ${summary.totalSpentAll.toFixed(2)}
        </Text>
        <Text size="sm" c="dimmed">
          Includes unbudgeted: ${summary.totalSpentUnbudgeted.toFixed(2)}
        </Text>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Text size="sm" c="dimmed">
          Total Budget (Limits)
        </Text>
        <Text fw={700} size="xl">
          ${summary.totalLimit.toFixed(2)}
        </Text>
        <Text size="sm" c="dimmed">
          Budgeted categories: {overview.items.length}
        </Text>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Text size="sm" c="dimmed">
          Spent (Budgeted)
        </Text>
        <Text fw={700} size="xl">
          ${summary.totalSpentBudgeted.toFixed(2)}
        </Text>
        <Text size="sm" c="dimmed">
          Remaining (budgeted): $
          {(summary.totalLimit - summary.totalSpentBudgeted).toFixed(2)}
        </Text>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Text size="sm" c="dimmed">
          Over Budget
        </Text>
        <Text fw={700} size="xl">
          {summary.overBudgetCount}
        </Text>
        <Text size="sm" c="dimmed">
          Categories over limit
        </Text>
      </Paper>
    </SimpleGrid>
  );
}

function BudgetEditModal({
  opened,
  onClose,
  categoryName,
  initialLimit,
  onSave,
  saving,
}: {
  opened: boolean;
  onClose: () => void;
  categoryName: string;
  initialLimit: number;
  onSave: (limit: number) => void;
  saving?: boolean;
}) {
  const [limit, setLimit] = useState<number>(initialLimit);

  // keep in sync when opening different rows
  // (simple approach: reset when modal opens)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    if (opened) setLimit(initialLimit);
    return null;
  }, [opened, initialLimit]);

  return (
    <Modal opened={opened} onClose={onClose} title="Set budget" centered>
      <Stack>
        <Box>
          <Text size="sm" c="dimmed">
            Category
          </Text>
          <Text fw={600}>{categoryName || "-"}</Text>
        </Box>

        <NumberInput
          label="Monthly limit"
          value={limit}
          onChange={(v) => setLimit(Number(v || 0))}
          min={0}
          decimalScale={2}
          fixedDecimalScale
          hideControls={false}
        />

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={saving}
            onClick={() => onSave(Number.isFinite(limit) ? limit : 0)}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

function BudgetedTable({
  items,
  query,
  only,
  onEdit,
}: {
  items: BudgetItem[];
  query: string;
  only: "all" | "warning" | "over";
  onEdit: (categoryId: string) => void;
}) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => (q ? i.categoryName.toLowerCase().includes(q) : true))
      .filter((i) => {
        const s = statusFor(i.spent, i.limit);
        if (only === "all") return true;
        return s === only;
      })
      .sort((a, b) => {
        // show worst offenders first
        const ap = pctUsed(a.spent, a.limit);
        const bp = pctUsed(b.spent, b.limit);
        return bp - ap;
      });
  }, [items, query, only]);

  const rows = filtered.map((i) => {
    const p = pctUsed(i.spent, i.limit);
    const pDisplay = clamp(p, 0, 1.5);
    const status = statusFor(i.spent, i.limit);
    const remaining = i.limit - i.spent;

    return (
      <Table.Tr key={i.categoryId}>
        <Table.Td>
          <Text fw={600}>{i.categoryName}</Text>
        </Table.Td>

        <Table.Td>
          <Text>${i.limit.toFixed(2)}</Text>
        </Table.Td>

        <Table.Td>
          <Text>${i.spent.toFixed(2)}</Text>
        </Table.Td>

        <Table.Td>
          <Text c={remaining < 0 ? "red" : undefined}>
            ${remaining.toFixed(2)}
          </Text>
        </Table.Td>

        <Table.Td w={220}>
          <Stack gap={6}>
            <Progress value={pDisplay * 100} />
            <Text size="xs" c="dimmed">
              {(p * 100).toFixed(0)}% used
            </Text>
          </Stack>
        </Table.Td>

        <Table.Td>{statusBadge(status)}</Table.Td>

        <Table.Td>
          <Tooltip label="Edit budget" withArrow>
            <ActionIcon variant="subtle" onClick={() => onEdit(i.categoryId)}>
              <IoPencilOutline />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" align="center" mb="xs">
        <Title order={4}>Budgeted categories</Title>
        <Text size="sm" c="dimmed">
          {filtered.length} shown
        </Text>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Category</Table.Th>
              <Table.Th>Limit</Table.Th>
              <Table.Th>Spent</Table.Th>
              <Table.Th>Remaining</Table.Th>
              <Table.Th>Progress</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed">No categories match your filters.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}

function UnbudgetedTable({
  items,
  query,
  onCreateBudget,
}: {
  items: UnbudgetedItem[];
  query: string;
  onCreateBudget: (categoryId: string) => void;
}) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => (q ? i.categoryName.toLowerCase().includes(q) : true))
      .sort((a, b) => b.spent - a.spent);
  }, [items, query]);

  const rows = filtered.map((i) => (
    <Table.Tr key={i.categoryId}>
      <Table.Td>
        <Text fw={600}>{i.categoryName}</Text>
      </Table.Td>
      <Table.Td>
        <Text>${i.spent.toFixed(2)}</Text>
      </Table.Td>
      <Table.Td>
        <Button
          size="xs"
          variant="light"
          onClick={() => onCreateBudget(i.categoryId)}
        >
          Set budget
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card withBorder radius="md" p="md">
      <Group justify="space-between" align="center" mb="xs">
        <Title order={4}>Unbudgeted spending</Title>
        <Text size="sm" c="dimmed">
          {filtered.length} shown
        </Text>
      </Group>

      <ScrollArea>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Category</Table.Th>
              <Table.Th>Spent</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text c="dimmed">
                    No unbudgeted spending for this period.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
}

/** -----------------------------
 * Page
 ------------------------------*/
export default function BudgetsPage() {
  const now = new Date();
  const [period, setPeriod] = useState<Period>({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  // Mock overview: rebuild when period changes
  const [overview, setOverview] = useState<BudgetOverview>(() =>
    buildMockOverview(period),
  );
  useMemo(() => {
    setOverview(buildMockOverview(period));
    return null;
  }, [period.year, period.month]);

  // Filters
  const [search, setSearch] = useState("");
  const [only, setOnly] = useState<"all" | "warning" | "over">("all");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const active = useMemo(() => {
    if (!activeCategoryId) return null;

    const inBudgeted = overview.items.find(
      (x) => x.categoryId === activeCategoryId,
    );
    if (inBudgeted) return { kind: "budgeted" as const, ...inBudgeted };

    const inUnbudgeted = overview.unbudgeted.find(
      (x) => x.categoryId === activeCategoryId,
    );
    if (inUnbudgeted) {
      return { kind: "unbudgeted" as const, ...inUnbudgeted, limit: 0 };
    }

    return null;
  }, [activeCategoryId, overview.items, overview.unbudgeted]);

  const onEditBudgeted = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setModalOpen(true);
  };

  const onCreateBudgetFromUnbudgeted = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setModalOpen(true);
  };

  const saveBudget = (limit: number) => {
    if (!activeCategoryId) return;

    // MOCK "upsert budget":
    // - if already in items: update limit
    // - else: move from unbudgeted to budgeted with that limit
    setOverview((prev) => {
      const existingIdx = prev.items.findIndex(
        (x) => x.categoryId === activeCategoryId,
      );

      // If already budgeted, update limit
      if (existingIdx >= 0) {
        const nextItems = [...prev.items];
        nextItems[existingIdx] = { ...nextItems[existingIdx], limit };
        return { ...prev, items: nextItems };
      }

      // If unbudgeted, move it into budgeted
      const ub = prev.unbudgeted.find((x) => x.categoryId === activeCategoryId);
      if (ub) {
        const nextUnbudgeted = prev.unbudgeted.filter(
          (x) => x.categoryId !== activeCategoryId,
        );
        const nextItems = [
          ...prev.items,
          {
            categoryId: ub.categoryId,
            categoryName: ub.categoryName,
            limit,
            spent: ub.spent,
          },
        ].sort((a, b) => a.categoryName.localeCompare(b.categoryName));

        return { ...prev, items: nextItems, unbudgeted: nextUnbudgeted };
      }

      return prev;
    });

    setModalOpen(false);
  };

  const monthLabel =
    MONTHS.find((m) => Number(m.value) === period.month)?.label ??
    String(period.month);

  return (
    <Container size="lg" py="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-end">
          <Box>
            <Title order={2}>Budgets</Title>
            <Text c="dimmed" size="sm">
              Track spending vs limits for {monthLabel} {period.year}
            </Text>
          </Box>

          <PeriodPicker value={period} onChange={setPeriod} />
        </Group>

        <SummaryCards overview={overview} />

        <Divider />

        <Card withBorder radius="md" p="md">
          <Group justify="space-between" align="center">
            <TextInput
              placeholder="Search categories..."
              leftSection={<IoSearchOutline />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              w={{ base: "100%", sm: 320 }}
            />

            <Select
              value={only}
              onChange={(v) => setOnly((v as any) ?? "all")}
              data={[
                { value: "all", label: "All" },
                { value: "warning", label: "Warning only" },
                { value: "over", label: "Over only" },
              ]}
              w={{ base: "100%", sm: 200 }}
            />
          </Group>
        </Card>

        <BudgetedTable
          items={overview.items}
          query={search}
          only={only}
          onEdit={onEditBudgeted}
        />

        <UnbudgetedTable
          items={overview.unbudgeted}
          query={search}
          onCreateBudget={onCreateBudgetFromUnbudgeted}
        />

        <BudgetEditModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          categoryName={active?.categoryName ?? ""}
          initialLimit={active?.limit ?? 0}
          onSave={saveBudget}
        />
      </Stack>
    </Container>
  );
}
