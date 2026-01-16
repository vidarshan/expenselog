import { NAVBAR_HEIGHT } from "../data/mockdata";
import {
  ActionIcon,
  Affix,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Popover,
  Title,
  Transition,
} from "@mantine/core";
import {
  IoAppsOutline,
  IoColorWandOutline,
  IoDocumentOutline,
  IoEllipsisVerticalOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useWindowScroll } from "@mantine/hooks";
import TransactionTable from "../components/tables/TransactionTable";
import ComparisonChart from "../components/charts/ComparisonChart";
import ContributionChart from "../components/charts/ContributionChart";
import OverviewCard from "../components/OverviewCard";

const MonthlyPage = () => {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>January 2025</Title>
          <Badge>Open</Badge>
        </Box>
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon variant="light" size="lg">
              <IoEllipsisVerticalOutline />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Button leftSection={<IoAppsOutline />} fullWidth>
              Create category
            </Button>
            <Button mt="sm" leftSection={<IoDocumentOutline />} fullWidth>
              Export as PDF
            </Button>
            <Button
              color="red"
              mt="sm"
              leftSection={<IoTrashOutline />}
              fullWidth
            >
              Close Report
            </Button>
          </Popover.Dropdown>
        </Popover>
      </Group>
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <OverviewCard />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 5, lg: 5, xl: 5 }}>
          <ContributionChart />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 7, lg: 7, xl: 7 }}>
          <ComparisonChart />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <TransactionTable />
        </Grid.Col>
      </Grid>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={true}>
          {(transitionStyles) => (
            <Button
              variant="gradient"
              radius="xl"
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              <Flex align="center">
                <IoColorWandOutline style={{ marginRight: "0.2rem" }} />
                {scroll.y === 0 && "AI Insights"}
              </Flex>
            </Button>
          )}
        </Transition>
      </Affix>
    </Container>
  );
};

export default MonthlyPage;
