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
import ActivityChart from "../components/charts/ActivityChart";
import { useParams } from "react-router-dom";
import { appData } from "../data/appData";

const YearlyPage = () => {
  const { year } = useParams();
  const yearlyData = appData.find((i) => i.year == Number(year));
  const previousYearlyData = appData.find((i) => i.year == Number(year) - 1);
  console.log("yearlyData", yearlyData);
  console.log("prev", previousYearlyData);

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <QuickActions withActions={true} title={year} />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <OverviewCard
            prevIncome={previousYearlyData?.summary?.income}
            currentIncome={yearlyData?.summary?.income}
            prevExpense={previousYearlyData?.summary?.expenses}
            currentExpenses={yearlyData?.summary?.expenses}
            prevTransactions={previousYearlyData?.summary?.transactionCount}
            currentTransactions={yearlyData?.summary?.transactionCount}
            gainOrLoss={yearlyData?.summary?.net}
            unit="year"
          />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <ContributionChart />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <ComparisonChart />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <ActivityChart data={yearlyData.heatmap} />
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
