import {
  Badge,
  Box,
  Button,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useState } from "react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { ACCENT_TONES } from "../../utils/accents";

const ChartPanel = ({
  icon,
  title,
  eyebrow,
  description,
  action,
  accent = "lime",
  collapsible = true,
  defaultCollapsed = false,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

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
          <Group gap="xs" align="center">
            {typeof action === "string" ? (
              <Badge variant="light">{action}</Badge>
            ) : (
              action
            )}
            {collapsible ? (
              <Button
                size="xs"
                radius="xl"
                variant="subtle"
                onClick={() => setCollapsed((value) => !value)}
                leftSection={
                  collapsed ? (
                    <IoArrowDown size={14} />
                  ) : (
                    <IoArrowUp size={14} />
                  )
                }
                styles={{
                  root: {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "inherit",
                  },
                }}
              >
                {collapsed ? "Expand" : "Collapse"}
              </Button>
            ) : null}
          </Group>
        </Group>

        <Collapse in={!collapsed}>
          <Paper withBorder radius="1.25rem" p="md" style={{ flex: 1 }}>
            {children}
          </Paper>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default ChartPanel;
