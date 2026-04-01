import { Group, Paper, Progress, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core";
import { IoWalletOutline } from "react-icons/io5";
import ChartPanel from "./ChartPanel";

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function BudgetInsightsCard({ summary, periodLabel }) {
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
                tooltip: `Spent - ${formatMoney(spentWithinBudget)}`,
                value: (spentWithinBudget / usageBase) * 100,
                color: "lime",
              }
            : null,
          remaining > 0
            ? {
                key: "remaining",
                label: "Left",
                tooltip: `Remaining - ${formatMoney(remaining)}`,
                value: (remaining / usageBase) * 100,
                color: "gray",
              }
            : null,
          overspent > 0
            ? {
                key: "overspent",
                label: "Over",
                tooltip: `Overspent - ${formatMoney(overspent)}`,
                value: (overspent / usageBase) * 100,
                color: "red",
              }
            : null,
        ].filter(Boolean)
      : [];

  return (
    <ChartPanel
      icon={<IoWalletOutline size={20} />}
      title="Budget Usage"
      eyebrow="Monthly budgets"
      accent="lime"
      action={totalLimit > 0 ? `${Math.round((totalSpent / totalLimit) * 100)}% used` : "No limit"}
      description={`Track how much of your planned budget has been spent, what is left, and whether ${periodLabel || "the selected period"} has started to run hot.`}
    >
      <Stack gap="lg" h="100%">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
          {[
            { label: "Planned", value: formatMoney(totalLimit) },
            { label: "Spent", value: formatMoney(totalSpent) },
            {
              label: overspent > 0 ? "Over budget" : "Remaining",
              value: formatMoney(overspent > 0 ? overspent : remaining),
            },
          ].map((item) => (
            <Paper key={item.label} withBorder radius="lg" p="sm">
              <Text size="xs" c="dimmed">
                {item.label}
              </Text>
              <Text fw={700} mt={4}>
                {item.value}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={600} size="sm">
              Overall budget usage
            </Text>
            <Text size="sm" c="dimmed">
              {formatMoney(totalSpent)} of {formatMoney(totalLimit)}
            </Text>
          </Group>

          {totalLimit > 0 ? (
            <>
              <Progress.Root size={20} radius="xl">
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

              <Group justify="space-between" mt={4}>
                <Text size="sm" c="dimmed">
                  {overspent > 0
                    ? `You are over budget by ${formatMoney(overspent)}`
                    : `${formatMoney(remaining)} left in budget`}
                </Text>

                <Text size="sm" fw={700} c={overspent > 0 ? "red" : "lime"}>
                  {overspent > 0 ? "Needs attention" : "On track"}
                </Text>
              </Group>
            </>
          ) : (
            <Text size="sm" c="dimmed">
              No budget limits set for {periodLabel || "the selected period"}.
            </Text>
          )}
        </Stack>
      </Stack>
    </ChartPanel>
  );
}

export default BudgetInsightsCard;
