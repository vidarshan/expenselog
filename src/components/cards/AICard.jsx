import {
  Badge,
  Box,
  Button,
  Card,
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
                Personalized financial signals and recommendations
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
            {collapsed ? "Expand" : "Collapse"}
          </Button>
        </Group>

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

              <SectionBlock
                icon={<IoSparklesOutline />}
                title="What I noticed"
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
                title="Possible root causes"
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
                title="Micro challenges"
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
                title="Risk signals"
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
                  title="Forecast"
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

              {nextBestMove ? (
                <SectionBlock
                  icon={<IoRocketOutline />}
                  title="Next best move"
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
            </Stack>
          </Collapse>
        )}
      </Stack>
    </Paper>
  );
}
