import React from "react";
import { NAVBAR_HEIGHT } from "../data/mockdata";
import {
  Affix,
  Button,
  Container,
  Flex,
  Grid,
  Transition,
} from "@mantine/core";
import QuickActions from "../components/QuickActions";
import OverviewCard from "../components/OverviewCard";
import ContributionChart from "../components/charts/ContributionChart";
import ComparisonChart from "../components/charts/ComparisonChart";
import TransactionTable from "../components/tables/TransactionTable";
import { IoColorWandOutline } from "react-icons/io5";

const YearlyPage = () => {
  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <QuickActions withActions={true} title="January 2026" />
        </Grid.Col>
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

export default YearlyPage;
