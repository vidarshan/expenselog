import { Badge, Box, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";

const ACCENT_TONES = {
  lime: "rgba(163, 230, 53, 0.14)",
  blue: "rgba(96, 165, 250, 0.14)",
  orange: "rgba(251, 146, 60, 0.14)",
  pink: "rgba(244, 114, 182, 0.14)",
  gray: "rgba(255, 255, 255, 0.05)",
};

const ChartPanel = ({
  icon,
  title,
  eyebrow,
  description,
  action,
  accent = "lime",
  children,
}) => {
  return (
    <Paper
      h="100%"
      withBorder
      radius="1.5rem"
      p="md"
      style={{
        background: `linear-gradient(180deg, ${ACCENT_TONES[accent] || ACCENT_TONES.gray}, rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01))`,
      }}
    >
      <Stack h="100%" gap="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="sm" align="flex-start" wrap="nowrap">
            {icon ? (
              <ThemeIcon
                size={42}
                radius="xl"
                variant="light"
                color={accent}
                mt={2}
              >
                {icon}
              </ThemeIcon>
            ) : null}

            <Box>
              {eyebrow ? (
                <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                  {eyebrow}
                </Text>
              ) : null}
              <Text fw={700} size="lg">
                {title}
              </Text>
              {description ? (
                <Text size="sm" c="dimmed" mt={4} maw={560}>
                  {description}
                </Text>
              ) : null}
            </Box>
          </Group>

          {action ? <Badge variant="light">{action}</Badge> : null}
        </Group>

        <Paper withBorder radius="1.25rem" p="md" style={{ flex: 1 }}>
          {children}
        </Paper>
      </Stack>
    </Paper>
  );
};

export default ChartPanel;
