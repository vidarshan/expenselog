import {
  Card,
  Group,
  Text,
  Badge,
  Stack,
  Divider,
  Button,
  Box,
  Paper,
} from "@mantine/core";
import {
  IoAlertCircleOutline,
  IoRocketOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { SiOpenai } from "react-icons/si";

const sevColor = (s) =>
  s === "high" ? "red" : s === "medium" ? "yellow" : "green";

export function AIInsightsCard({
  title = "AI Insights",
  insights = [],
  actions = [],
  risks = [],
  onRegenerate = true,
}) {
  return (
    <Card
      radius="lg"
      withBorder
      style={{
        overflow: "hidden",
        // subtle AI glow
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.06), 0 18px 70px rgba(139,92,246,0.12)",
      }}
    >
      {/* Gradient header */}
      <Paper
        mb="xs"
        p="md"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(34,211,238,0.12))",
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap={10}>
            <IoSparklesOutline size={18} />
            <Text fw={800}>{title}</Text>
          </Group>

          {onRegenerate && (
            <Button
              size="xs"
              c="dark"
              variant="white"
              radius="lg"
              // onClick={onRegenerate}
              leftSection={<SiOpenai size={16} />}
            >
              Regenerate
            </Button>
          )}
        </Group>

        <Text size="sm" c="dimmed" mt={6}>
          Coach-style insights (not dashboard repeats)
        </Text>
      </Paper>

      {/* Body */}
      <Stack p="md" gap="sm">
        <Group gap={8}>
          <IoSparklesOutline size={16} />
          <Text fw={700}>What I noticed</Text>
        </Group>
        <Stack gap={6}>
          {(insights.length ? insights : ["No insights yet."])
            .slice(0, 3)
            .map((x, i) => (
              <Text key={i} size="sm">
                • {x}
              </Text>
            ))}
        </Stack>

        <Divider />

        <Group gap={8}>
          <IoRocketOutline size={16} />
          <Text fw={700}>Next actions</Text>
        </Group>
        <Stack gap={6}>
          {(actions.length ? actions : ["Generate insights to get next steps."])
            .slice(0, 3)
            .map((x, i) => (
              <Text key={i} size="sm">
                • {x}
              </Text>
            ))}
        </Stack>

        <Divider />

        <Group gap={8}>
          <IoAlertCircleOutline size={16} />
          <Text fw={700}>Risk flags</Text>
        </Group>

        {risks.length ? (
          <Group gap={8} wrap="wrap">
            {risks.slice(0, 4).map((r, i) => (
              <Badge
                key={i}
                color={sevColor(r.severity)}
                variant="light"
                radius="xl"
              >
                {r.label}
              </Badge>
            ))}
          </Group>
        ) : (
          <Text size="sm" c="dimmed">
            No risk flags detected.
          </Text>
        )}
      </Stack>
    </Card>
  );
}
