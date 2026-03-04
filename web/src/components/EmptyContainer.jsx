import { Flex, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { PiHeartStraightBreakBold } from "react-icons/pi";

const EmptyContainer = ({ message }) => {
  return (
    <Paper my="sm" h="40vh" withBorder p="md">
      <Flex h="100%" justify="center" align="center">
        <Stack align="center" gap="xs">
          <ThemeIcon size={60} radius="xl" color="red" variant="light">
            <PiHeartStraightBreakBold size={32} />
          </ThemeIcon>

          <Text size="lg" fw={500} c="dimmed">
            {message}
          </Text>
        </Stack>
      </Flex>
    </Paper>
  );
};

export default EmptyContainer;
