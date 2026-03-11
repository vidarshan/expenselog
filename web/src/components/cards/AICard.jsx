import {
  Card,
  Group,
  Text,
  Badge,
  Stack,
  Divider,
  Button,
  Paper,
  Box,
  ThemeIcon,
} from "@mantine/core";
import {
  IoAlertCircleOutline,
  IoRocketOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { SiOpenai } from "react-icons/si";

const sevColor = (s) =>
  s === "high" ? "red" : s === "medium" ? "yellow" : "green";

function SectionBlock({ icon, title, children }) {
  return (
    <Stack gap="xs">
      <Group gap="xs">
        <ThemeIcon size={28} radius="xl" variant="light" color="violet">
          {icon}
        </ThemeIcon>
        <Text fw={700} size="sm">
          {title}
        </Text>
      </Group>
      {children}
    </Stack>
  );
}

export function AIInsightsCard({
  title = "AI Insights",
  insights = [],
  actions = [],
  risks = [],
  onRegenerate,
}) {
  const handleRegenerate =
    typeof onRegenerate === "function" ? onRegenerate : undefined;

  return (
    <Card
      radius="lg"
      withBorder
      p="lg"
      style={{
        background:
          "linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(34,211,238,0.04) 100%)",
        border: "1px solid rgba(139,92,246,0.35)",
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size={40} radius="xl" variant="light" color="violet">
              <IoSparklesOutline size={20} />
            </ThemeIcon>

            <Box>
              <Group gap={8}>
                <Text fw={800} size="lg">
                  {title}
                </Text>
               
              </Group>
              <Text size="sm" c="dimmed">
                Personalized financial signals and recommendations
              </Text>
            </Box>
          </Group>

          {handleRegenerate && (
            <Button
              size="xs"
              radius="xl"
              variant="light"
              color="violet"
              leftSection={<SiOpenai size={14} />}
              onClick={handleRegenerate}
            >
              Regenerate
            </Button>
          )}
        </Group>

        <Divider />

        <SectionBlock
          icon={<IoSparklesOutline size={15} />}
          title="What AI noticed"
        >
          <Stack gap="xs">
            {(insights.length ? insights : ["No insights yet."])
              .slice(0, 3)
              .map((x, i) => (
                <Paper key={i} p="sm" radius="md" withBorder>
                  <Text size="sm">{x}</Text>
                </Paper>
              ))}
          </Stack>
        </SectionBlock>

        <SectionBlock
          icon={<IoRocketOutline size={15} />}
          title="Recommended next actions"
        >
          <Stack gap="xs">
            {(actions.length
              ? actions
              : ["Generate insights to get suggested actions."]
            )
              .slice(0, 3)
              .map((x, i) => (
                <Paper key={i} p="sm" radius="md" withBorder>
                  <Text size="sm">{x}</Text>
                </Paper>
              ))}
          </Stack>
        </SectionBlock>

        <SectionBlock
          icon={<IoAlertCircleOutline size={15} />}
          title="Risk signals"
        >
          {risks.length ? (
            <Stack gap="xs">
              {risks.slice(0, 3).map((r, i) => (
                <Paper key={i} p="sm" radius="md" withBorder>
                  <Group justify="space-between" wrap="nowrap">
                    <Text size="sm" fw={600}>
                      {r.label}
                    </Text>
                    <Badge color={sevColor(r.severity)} variant="light">
                      {r.severity}
                    </Badge>
                  </Group>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Text size="sm" c="dimmed">
              No risk flags detected.
            </Text>
          )}
        </SectionBlock>
      </Stack>
    </Card>
  );
}
