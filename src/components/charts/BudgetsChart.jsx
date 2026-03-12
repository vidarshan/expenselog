import { Card, Group, Progress, Stack, Text, Tooltip } from "@mantine/core";

function groupTopItems(items, key, max = 4) {
  const sorted = [...items]
    .filter((item) => Number(item[key] || 0) > 0)
    .sort((a, b) => Number(b[key] || 0) - Number(a[key] || 0));

  const top = sorted.slice(0, max);
  const rest = sorted.slice(max);

  const otherValue = rest.reduce(
    (sum, item) => sum + Number(item[key] || 0),
    0,
  );

  if (otherValue > 0) {
    top.push({
      categoryId: "other",
      categoryName: "Other",
      [key]: otherValue,
    });
  }

  return top;
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function BudgetInsightsCard({ summary, items }) {
  const totalLimit = Number(summary?.totalLimit || 0);
  const totalSpent = Number(
    summary?.totalSpentBudgeted ?? summary?.totalSpent ?? 0,
  );

  const spentWithinBudget = Math.min(totalSpent, totalLimit);
  const remaining = Math.max(totalLimit - totalSpent, 0);
  const overspent = Math.max(totalSpent - totalLimit, 0);

  const usageBase = overspent > 0 ? totalLimit + overspent : totalLimit;

  const usageSections =
    totalLimit > 0
      ? [
          spentWithinBudget > 0
            ? {
                key: "spent",
                label: "Spent",
                tooltip: `Spent – ${formatMoney(spentWithinBudget)}`,
                value: (spentWithinBudget / usageBase) * 100,
                color: "lime",
              }
            : null,
          remaining > 0
            ? {
                key: "remaining",
                label: "Left",
                tooltip: `Remaining – ${formatMoney(remaining)}`,
                value: (remaining / usageBase) * 100,
                color: "gray",
              }
            : null,
          overspent > 0
            ? {
                key: "overspent",
                label: "Over",
                tooltip: `Overspent – ${formatMoney(overspent)}`,
                value: (overspent / usageBase) * 100,
                color: "red",
              }
            : null,
        ].filter(Boolean)
      : [];

  const topSpent = groupTopItems(items || [], "spent", 4);
  const topLimit = groupTopItems(items || [], "limit", 4);

  const totalTopSpent = topSpent.reduce(
    (sum, item) => sum + Number(item.spent || 0),
    0,
  );
  const totalTopLimit = topLimit.reduce(
    (sum, item) => sum + Number(item.limit || 0),
    0,
  );

  return (
    <Card withBorder radius="lg" p="md">
      <Stack gap="lg">
        <Stack gap="xs">
          <Text fw={700}>Budget Insights</Text>
          <Text size="sm" c="dimmed">
            See your overall budget usage and which categories make up the most
            spending and budget allocation this month.
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={600} size="sm">
              Overall Budget Usage
            </Text>
            <Text size="sm" c="dimmed">
              {formatMoney(totalSpent)} of {formatMoney(totalLimit)}
            </Text>
          </Group>

          {totalLimit > 0 ? (
            <>
              <Progress.Root size={18} radius="xl">
                {usageSections.map((section) => (
                  <Tooltip key={section.key} label={section.tooltip}>
                    <Progress.Section
                      value={section.value}
                      color={section.color}
                    >
                      <Progress.Label>{section.label}</Progress.Label>
                    </Progress.Section>
                  </Tooltip>
                ))}
              </Progress.Root>

              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  {overspent > 0
                    ? `You are over budget by ${formatMoney(overspent)}`
                    : `${formatMoney(remaining)} left in budget`}
                </Text>

                <Text size="sm" fw={600} c={overspent > 0 ? "red" : "dimmed"}>
                  {totalLimit > 0
                    ? `${Math.round((totalSpent / totalLimit) * 100)}% used`
                    : "0% used"}
                </Text>
              </Group>
            </>
          ) : (
            <Text size="sm" c="dimmed">
              No budget limits set for this month.
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

export default BudgetInsightsCard;
