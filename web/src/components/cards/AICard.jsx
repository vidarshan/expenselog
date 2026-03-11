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
  RingProgress,
} from "@mantine/core";
import {
  IoAlertCircleOutline,
  IoRocketOutline,
  IoSparklesOutline,
  IoPulseOutline,
} from "react-icons/io5";
import { SiOpenai } from "react-icons/si";

const sevColor = (s) =>
  s === "high" ? "red" : s === "medium" ? "yellow" : "green";

const sevTone = (s) =>
  s === "high"
    ? "High priority"
    : s === "medium"
      ? "Watch closely"
      : "Low concern";

function SectionBlock({ icon, title, children }) {
  return (
    <Paper
      radius="xl"
      p="md"
      withBorder
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Group gap="sm" mb="sm">
        <ThemeIcon
          size={34}
          radius="xl"
          variant="gradient"
          gradient={{ from: "violet", to: "cyan", deg: 135 }}
        >
          {icon}
        </ThemeIcon>
        <Box>
          <Text fw={700} size="sm">
            {title}
          </Text>
          <Text size="xs" c="dimmed">
            AI-generated summary
          </Text>
        </Box>
      </Group>

      {children}
    </Paper>
  );
}

export function AIInsightsCard({
  title = "AI Insights",
  insights = [],
  actions = [],
  risks = [],
  onRegenerate = true,
}) {
  const riskScore = risks.length
    ? Math.min(
        100,
        risks.reduce((acc, r) => {
          if (r.severity === "high") return acc + 34;
          if (r.severity === "medium") return acc + 20;
          return acc + 10;
        }, 0),
      )
    : 6;

  const handleRegenerate =
    typeof onRegenerate === "function" ? onRegenerate : undefined;

  return (
    <Card
      radius="xl"
      withBorder
      p={0}
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(14,18,32,0.98) 0%, rgba(12,15,28,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03), 0 24px 80px rgba(80, 70, 229, 0.18)",
      }}
    >
      {/* ambient glow */}
      <Box
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(139,92,246,0.18)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: -90,
          left: -70,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(34,211,238,0.14)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* top accent line */}
      <Box
        style={{
          height: 3,
          width: "100%",
          background:
            "linear-gradient(90deg, rgba(139,92,246,1), rgba(34,211,238,1), rgba(168,85,247,1))",
        }}
      />

      {/* header */}
      <Paper
        radius={0}
        p="lg"
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(34,211,238,0.08))",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group align="flex-start" gap="sm" wrap="nowrap">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="gradient"
              gradient={{ from: "violet", to: "cyan", deg: 135 }}
            >
              <IoSparklesOutline size={22} />
            </ThemeIcon>

            <Box>
              <Group gap={8} mb={4}>
                <Text fw={800} size="lg">
                  {title}
                </Text>
                <Badge
                  radius="xl"
                  variant="filled"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(34,211,238,0.95))",
                    color: "white",
                    border: "none",
                  }}
                >
                  AI
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                Personalized analysis, recommendations, and risk signals
              </Text>
            </Box>
          </Group>

          <Group gap="sm" wrap="nowrap">
            <RingProgress
              size={56}
              thickness={6}
              roundCaps
              sections={[{ value: riskScore, color: "violet" }]}
              label={
                <Text ta="center" size="xs" fw={700}>
                  {riskScore}
                </Text>
              }
            />

            {onRegenerate && (
              <Button
                size="xs"
                radius="xl"
                variant="gradient"
                gradient={{ from: "violet", to: "cyan", deg: 135 }}
                leftSection={<SiOpenai size={14} />}
                onClick={handleRegenerate}
                styles={{
                  root: {
                    boxShadow: "0 8px 24px rgba(139,92,246,0.25)",
                  },
                }}
              >
                Regenerate
              </Button>
            )}
          </Group>
        </Group>
      </Paper>

      {/* body */}
      <Stack p="lg" gap="md" style={{ position: "relative", zIndex: 1 }}>
        <SectionBlock
          icon={<IoSparklesOutline size={16} />}
          title="What AI noticed"
        >
          <Stack gap={8}>
            {(insights.length ? insights : ["No insights yet."])
              .slice(0, 3)
              .map((x, i) => (
                <Paper
                  key={i}
                  p="sm"
                  radius="lg"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Text size="sm" lh={1.55}>
                    <Text
                      component="span"
                      fw={800}
                      style={{
                        background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginRight: 6,
                      }}
                    >
                      ✦
                    </Text>
                    {x}
                  </Text>
                </Paper>
              ))}
          </Stack>
        </SectionBlock>

        <SectionBlock
          icon={<IoRocketOutline size={16} />}
          title="Recommended next actions"
        >
          <Stack gap={8}>
            {(actions.length
              ? actions
              : ["Generate insights to get smart next steps."]
            )
              .slice(0, 3)
              .map((x, i) => (
                <Paper
                  key={i}
                  p="sm"
                  radius="lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(34,211,238,0.04))",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <Group gap={8} align="flex-start" wrap="nowrap">
                    <ThemeIcon
                      size={22}
                      radius="xl"
                      variant="light"
                      color="violet"
                    >
                      <IoRocketOutline size={12} />
                    </ThemeIcon>
                    <Text size="sm" lh={1.55}>
                      {x}
                    </Text>
                  </Group>
                </Paper>
              ))}
          </Stack>
        </SectionBlock>

        <SectionBlock
          icon={<IoAlertCircleOutline size={16} />}
          title="Risk signals"
        >
          {risks.length ? (
            <Stack gap="sm">
              <Group gap={8} wrap="wrap">
                {risks.slice(0, 4).map((r, i) => (
                  <Badge
                    key={i}
                    size="lg"
                    radius="xl"
                    variant="light"
                    color={sevColor(r.severity)}
                    styles={{
                      root: {
                        textTransform: "none",
                        fontWeight: 700,
                        paddingInline: 14,
                        border: "1px solid rgba(255,255,255,0.06)",
                      },
                    }}
                  >
                    {r.label}
                  </Badge>
                ))}
              </Group>

              <Divider color="rgba(255,255,255,0.08)" />

              <Stack gap={6}>
                {risks.slice(0, 3).map((r, i) => (
                  <Group key={i} justify="space-between" wrap="nowrap">
                    <Group gap={8} wrap="nowrap">
                      <ThemeIcon
                        size={24}
                        radius="xl"
                        variant="light"
                        color={sevColor(r.severity)}
                      >
                        <IoPulseOutline size={13} />
                      </ThemeIcon>
                      <Text size="sm">{r.label}</Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {sevTone(r.severity)}
                    </Text>
                  </Group>
                ))}
              </Stack>
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
