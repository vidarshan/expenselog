import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import React from "react";
import { FcMoneyTransfer } from "react-icons/fc";
import { FiCalendar, FiLock, FiPieChart } from "react-icons/fi";
import Logo from "../components/Logo";
import { useDisclosure } from "@mantine/hooks";
import Login from "../components/Login";
import { RiNumber1 } from "react-icons/ri";
import Feature from "../components/Feature";
import { useNavigate } from "react-router-dom";
import { NAVBAR_HEIGHT } from "../data/mockdata";

const HomePage = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
      <Login opened={opened} close={close} />
      <Box h={`calc(80vh - ${NAVBAR_HEIGHT}px)`}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          gap="md"
        >
          <Title order={1} ta="center" size="3.5rem" fw={600}>
            Understand your money,
          </Title>

          <Title order={1} ta="center" c="dimmed" size="3.5rem" fw={600}>
            Without overthinking it.
          </Title>

          <Text
            ta="center"
            mt="lg"
            fw={500}
            size="lg"
            c="dimmed"
            maw={720}
            lh={1.6}
          >
            A simple expense tracker that helps you log income and expenses,
            visualize spending patterns, and stay aware of where your money
            goes.
          </Text>

          <Button
            mt="xl"
            size="lg"
            //onClick={open}
            onClick={() => {
              navigate("/dashboard");
              open();
            }}
          >
            View features
          </Button>
        </Flex>
      </Box>

      <Divider my="xl" />

      <Stack align="center" gap="md" my="xl">
        <Title ta="center" c="lime">
          Why ExpenseLog?
        </Title>

        <Text ta="center" fw={500} size="md" c="dimmed" maw={720}>
          Most expense trackers push budgeting rules and restrictions.
          ExpenseLog focuses on awareness instead — helping you understand your
          spending without pressure, automation, or unnecessary complexity.
        </Text>
      </Stack>

      <Divider my="xl" />

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" my="xl">
        {[
          {
            step: "Step 1",
            title: "Log transactions",
            desc: "Add income and expenses with categories, dates, and notes.",
          },
          {
            step: "Step 2",
            title: "Review summaries",
            desc: "See monthly totals, balances, and spending breakdowns.",
          },
          {
            step: "Step 3",
            title: "Reflect & adjust",
            desc: "Notice patterns over time and make informed decisions.",
          },
        ].map((item) => (
          <Card key={item.step} withBorder radius="lg" p="lg">
            <Stack gap="xs">
              <Text size="xs" fw={700} c="lime" tt="uppercase">
                {item.step}
              </Text>

              <Title order={4} fw={500}>
                {item.title}
              </Title>

              <Text c="dimmed" lh={1.6}>
                {item.desc}
              </Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Divider my="xl" />
      <Stack align="center" my={64} gap="md">
        <Title ta="center" order={2}>
          Start tracking today
        </Title>

        <Text ta="center" c="dimmed" maw={600}>
          Build better awareness of your finances with a clean, focused
          experience designed to stay out of your way.
        </Text>
      </Stack>
      <SimpleGrid cols={{ base: 1, md: 1 }} spacing="xl" mb={100}>
        <Feature
          icon={<FiCalendar size={20} />}
          color="green"
          title="Monthly insights"
          desc="See balances, summaries, and spending breakdowns at a glance."
        />
        <Feature
          icon={<FiPieChart size={20} />}
          color="purple"
          title="Clear visuals"
          desc="Understand where your money goes with simple charts."
        />
        <Feature
          icon={<FiLock size={20} />}
          color="orange"
          title="Simple & private"
          desc="No bank connections. Your data stays intentional and local."
        />
      </SimpleGrid>
    </Container>
  );
};

export default HomePage;
