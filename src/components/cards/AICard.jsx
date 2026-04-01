import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  List,
  Paper,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useState } from "react";
import {
  IoAlertCircleOutline,
  IoArrowForward,
  IoArrowDown,
  IoArrowUp,
  IoCheckmarkCircleOutline,
  IoRocketOutline,
  IoSearchOutline,
  IoSparklesOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { ACCENT_TONES } from "../../utils/accents";

const sevColor = (severity) =>
  severity === "high" ? "red" : severity === "medium" ? "yellow" : "green";

const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

function SectionBlock({ icon, title, children, iconStyles }) {
  return (
    <Stack gap="sm">
      <Group gap="xs">
        <ThemeIcon radius="xl" variant="light" styles={iconStyles}>
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

function InfoCard({ title, children, paperStyle }) {
  return (
    <Paper p="sm" radius="lg" withBorder style={paperStyle}>
      <Stack gap={6}>
        <Text fw={700} size="sm">
          {title}
        </Text>
        {children}
      </Stack>
    </Paper>
  );
}

export function AIInsightsCard({ title = "AI Insights", content, loading }) {
  const [collapsed, setCollapsed] = useState(true);

  const behavioralInsights = content?.behavioral_insights || [];
  const rootCauseHypotheses = content?.root_cause_hypotheses || [];
  const microChallenges = content?.micro_challenges || [];
  const riskFlags = content?.risk_flags || [];
  const forecast = content?.forecast;
  const nextBestMove = content?.next_best_move;
  const insightCount =
    behavioralInsights.length +
    rootCauseHypotheses.length +
    microChallenges.length +
    riskFlags.length +
    (forecast ? 1 : 0) +
    (nextBestMove ? 1 : 0);
  const highestRisk = riskFlags.find((item) => item.severity === "high");
  const mediumRisk = riskFlags.find((item) => item.severity === "medium");
  const priorityRisk = highestRisk || mediumRisk || riskFlags[0];
  const primarySummary = nextBestMove?.message
    ? nextBestMove.message
    : priorityRisk?.message
      ? priorityRisk.message
      : behavioralInsights[0]?.message ||
        forecast?.message ||
        "Add a few more transactions this period to unlock stronger insight quality.";
  const statusTone = priorityRisk
    ? priorityRisk.severity === "high"
      ? { color: "red", label: "Needs attention" }
      : { color: "yellow", label: "Watch closely" }
    : insightCount > 0
      ? { color: "green", label: "Stable pattern" }
      : { color: "gray", label: "Still learning" };
  const summaryStats = [
    {
      label: "What stood out",
      value:
        insightCount > 0
          ? pluralize(behavioralInsights.length, "pattern")
          : "No signals yet",
    },
    {
      label: "Primary concern",
      value:
        riskFlags.length > 0
          ? pluralize(riskFlags.length, "risk flag")
          : "None detected",
    },
    {
      label: "Action ready",
      value: nextBestMove?.title || "Waiting for more data",
    },
  ];

  const innerPaperStyle = {
    background: "rgba(255,255,255,0.06)",

    backdropFilter: "blur(10px)",
  };

  const iconStyles = {
    root: {
      background:
        "linear-gradient(135deg, rgba(255,105,180,0.16) 0%, rgba(255,159,67,0.16) 100%)",
      color: "#e64980",
      border: "1px solid rgba(255,160,140,0.14)",
    },
  };

  const mainIconStyles = {
    root: {
      background:
        "linear-gradient(135deg, rgba(255,105,180,0.18) 0%, rgba(255,159,67,0.18) 100%)",
      color: "#e64980",
      border: "1px solid rgba(255,160,140,0.16)",
      boxShadow: "0 6px 18px rgba(255,140,120,0.10)",
    },
  };

  const actionButtonStyles = {
    root: {
      background:
        "linear-gradient(135deg, rgba(255,105,180,0.10) 0%, rgba(255,159,67,0.10) 100%)",
      color: "inherit",
      border: "1px solid rgba(255,160,140,0.14)",
    },
  };

  const accentBadgeStyles = {
    root: {
      width: "fit-content",
      background:
        "linear-gradient(135deg, rgba(255,105,180,0.12) 0%, rgba(255,159,67,0.12) 100%)",
      color: "inherit",
      border: "1px solid rgba(255,160,140,0.14)",
    },
  };

  const summaryPanelStyle = {
    ...innerPaperStyle,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
  };

  return (
    <Paper
      h="100%"
      withBorder
      radius="1.5rem"
      p="md"
      style={{
        background: `linear-gradient(180deg, ${ACCENT_TONES["pink"] || ACCENT_TONES.gray}, rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01))`,
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon
              size={42}
              radius="xl"
              variant="light"
              styles={mainIconStyles}
            >
              <IoSparklesOutline size={20} />
            </ThemeIcon>

            <Box>
              <Text fw={800} size="lg">
                {title}
              </Text>
              <Text size="sm" c="dimmed">
                A simpler read on what changed, why it matters, and what to do next
              </Text>
            </Box>
          </Group>

          <Button
            size="xs"
            radius="xl"
            variant="subtle"
            onClick={() => setCollapsed((value) => !value)}
            leftSection={
              collapsed ? <IoArrowDown size={14} /> : <IoArrowUp size={14} />
            }
            styles={actionButtonStyles}
          >
            {collapsed ? "Show details" : "Hide details"}
          </Button>
        </Group>

        <Paper p="md" radius="xl" withBorder style={summaryPanelStyle}>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Box maw={560}>
                <Group gap="xs" mb={6}>
                  <Badge color={statusTone.color} variant="light">
                    {statusTone.label}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    Start here
                  </Text>
                </Group>
                <Text fw={800} size="lg" lh={1.3}>
                  {nextBestMove?.title || priorityRisk?.title || "Main takeaway"}
                </Text>
                <Text size="sm" mt={6} c="dimmed">
                  {primarySummary}
                </Text>
              </Box>

              <Badge
                variant="light"
                size="lg"
                radius="xl"
                styles={accentBadgeStyles}
              >
                {insightCount} total signals
              </Badge>
            </Group>

            <Group grow align="stretch">
              {summaryStats.map((item) => (
                <Paper
                  key={item.label}
                  p="sm"
                  radius="lg"
                  withBorder
                  style={innerPaperStyle}
                >
                  <Text size="xs" c="dimmed">
                    {item.label}
                  </Text>
                  <Text fw={700} size="sm" mt={6}>
                    {item.value}
                  </Text>
                </Paper>
              ))}
            </Group>
          </Stack>
        </Paper>

        <Group grow>
          <Paper p="sm" radius="lg" withBorder style={innerPaperStyle}>
            <Text size="xs" c="dimmed">
              Signals surfaced
            </Text>
            <Text fw={800} size="xl" mt={4}>
              {insightCount}
            </Text>
          </Paper>
          <Paper p="sm" radius="lg" withBorder style={innerPaperStyle}>
            <Text size="xs" c="dimmed">
              Risk flags
            </Text>
            <Text fw={800} size="xl" mt={4}>
              {riskFlags.length}
            </Text>
          </Paper>
          <Paper p="sm" radius="lg" withBorder style={innerPaperStyle}>
            <Text size="xs" c="dimmed">
              Next move
            </Text>
            <Text fw={700} size="sm" mt={6}>
              {nextBestMove?.title || "Waiting for more data"}
            </Text>
          </Paper>
        </Group>

        {loading ? (
          <Stack>
            <Skeleton height={20} radius="sm" />
            <Skeleton height={20} radius="sm" />
            <Skeleton height={20} radius="sm" />
            <Skeleton height={20} radius="sm" />
            <Skeleton height={20} radius="sm" />
            <Skeleton height={20} radius="sm" />
          </Stack>
        ) : (
          <Collapse in={!collapsed}>
            <Stack gap="lg">
              <Divider style={{ borderColor: "rgba(255,255,255,0.08)" }} />

              {nextBestMove ? (
                <SectionBlock
                  icon={<IoRocketOutline />}
                  title="Recommended next step"
                  iconStyles={iconStyles}
                >
                  <InfoCard
                    title={nextBestMove.title}
                    paperStyle={innerPaperStyle}
                  >
                    <Text size="sm">{nextBestMove.message}</Text>
                    {nextBestMove.first_step_today ? (
                      <Badge variant="light" styles={accentBadgeStyles}>
                        Today: {nextBestMove.first_step_today}
                      </Badge>
                    ) : null}
                  </InfoCard>
                </SectionBlock>
              ) : null}

              <SectionBlock
                icon={<IoSparklesOutline />}
                title="What changed"
                iconStyles={iconStyles}
              >
                {behavioralInsights.length ? (
                  <Stack gap="xs">
                    {behavioralInsights.map((item, index) => (
                      <InfoCard
                        key={index}
                        title={item.title}
                        paperStyle={innerPaperStyle}
                      >
                        <Text size="sm">{item.message}</Text>
                        {item.evidence ? (
                          <Text size="xs" c="dimmed">
                            {item.evidence}
                          </Text>
                        ) : null}
                      </InfoCard>
                    ))}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    No behavioral insights available.
                  </Text>
                )}
              </SectionBlock>

              <SectionBlock
                icon={<IoSearchOutline />}
                title="Why this may be happening"
                iconStyles={iconStyles}
              >
                {rootCauseHypotheses.length ? (
                  <Stack gap="xs">
                    {rootCauseHypotheses.map((item, index) => (
                      <InfoCard
                        key={index}
                        title={item.title}
                        paperStyle={innerPaperStyle}
                      >
                        <Text size="sm">{item.message}</Text>
                        {item.what_to_check_next ? (
                          <Text size="xs" c="dimmed">
                            Next check: {item.what_to_check_next}
                          </Text>
                        ) : null}
                      </InfoCard>
                    ))}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    No root cause hypotheses available.
                  </Text>
                )}
              </SectionBlock>

              <SectionBlock
                icon={<IoCheckmarkCircleOutline />}
                title="Small experiment to try"
                iconStyles={iconStyles}
              >
                {microChallenges.length ? (
                  <Stack gap="xs">
                    {microChallenges.map((item, index) => (
                      <Paper
                        key={index}
                        p="sm"
                        radius="md"
                        withBorder
                        style={innerPaperStyle}
                      >
                        <Stack gap="xs">
                          <Text size="sm" fw={700}>
                            {item.title}
                          </Text>

                          {Array.isArray(item.rules) &&
                          item.rules.length > 0 ? (
                            <List size="sm" spacing={4}>
                              {item.rules.map((rule, ruleIndex) => (
                                <List.Item key={ruleIndex}>{rule}</List.Item>
                              ))}
                            </List>
                          ) : null}

                          {item.target ? (
                            <Badge variant="light" styles={accentBadgeStyles}>
                              Target: {item.target}
                            </Badge>
                          ) : null}

                          {item.first_step_today ? (
                            <Group gap={4}>
                              <IoArrowForward size={14} />
                              <Text size="xs" c="dimmed">
                                First step: {item.first_step_today}
                              </Text>
                            </Group>
                          ) : null}

                          {item.why ? (
                            <Text size="xs" c="dimmed">
                              {item.why}
                            </Text>
                          ) : null}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed">
                    No challenges suggested yet.
                  </Text>
                )}
              </SectionBlock>

              <SectionBlock
                icon={<IoAlertCircleOutline />}
                title="What to watch"
                iconStyles={iconStyles}
              >
                {riskFlags.length ? (
                  <Stack gap="xs">
                    {(riskFlags || []).map((item, index) => (
                      <Paper
                        key={index}
                        p="sm"
                        radius="lg"
                        withBorder
                        style={innerPaperStyle}
                      >
                        <Group
                          justify="space-between"
                          align="flex-start"
                          wrap="nowrap"
                        >
                          <Box style={{ flex: 1 }}>
                            <Text size="sm" fw={700}>
                              {item.title}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {item.message}
                            </Text>
                          </Box>

                          <Badge
                            color={sevColor(item.severity)}
                            variant="light"
                          >
                            {item.severity}
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

              {forecast ? (
                <SectionBlock
                  icon={<IoTrendingUpOutline />}
                  title="What happens if the pattern continues"
                  iconStyles={iconStyles}
                >
                  <InfoCard title={forecast.title} paperStyle={innerPaperStyle}>
                    <Text size="sm">{forecast.message}</Text>
                    {forecast.assumption ? (
                      <Text size="xs" c="dimmed">
                        Assumption: {forecast.assumption}
                      </Text>
                    ) : null}
                  </InfoCard>
                </SectionBlock>
              ) : null}

            </Stack>
          </Collapse>
        )}
      </Stack>
    </Paper>
  );
}
