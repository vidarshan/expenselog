import { useState } from "react";
import {
  NAVBAR_HEIGHT,
  recentTransactions,
  yearlyMonthlyReports,
} from "../data/mockdata";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  Modal,
  NumberInput,
  Pagination,
  Radio,
  ScrollArea,
  SegmentedControl,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IoCalendarClearOutline,
  IoCalendarOutline,
  IoFilterOutline,
  IoTrashOutline,
  IoTrendingDownOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { nanoid } from "nanoid";
import moment from "moment";
import ContributionChart from "../components/charts/ContributionChart";
import OverviewCard from "../components/OverviewCard";
import ComparisonChart from "../components/charts/ComparisonChart";

import YearAndMonthly from "../components/tables/YearAndMonthly";
import { useNavigate } from "react-router-dom";
import { appData } from "../data/appData";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComparisons, getDashboard } from "../store/slices/dashboardSlice";
import Loading from "../components/Loading";
import { getActivePeriods, getMonthlyLogs } from "../store/slices/logSlice";
import { getTransactions } from "../store/slices/transactionsSlice";

const LogsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, transactions } = useSelector(
    (state) => state.transactions,
  );
  const { monthlyLogs } = useSelector((state) => state.logs);

  const [mode, setMode] = useState("This Month");
  const [activePage, setActivePage] = useState(1);

  const handlePageChange = (value) => {
    setActivePage(value);
    dispatch(getTransactions({ year: 2026, month: 1, page: value, limit: 10 }));
  };

  console.log("transactions", transactions);

  const handleModeChange = (value) => {
    if (value === "This Month") {
      setMode(value);
      dispatch(getTransactions({ year: 2026, month: 1, page: 1, limit: 10 }));
    } else if (value === "Monthly") {
      setMode(value);
      dispatch(getMonthlyLogs({ page: 1, limit: 10 }));
    }
  };

  const thisLogs = transactions.data.map((element) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.amount}</Table.Td>
      <Table.Td>{element.type}</Table.Td>
      <Table.Td>{element.categoryName}</Table.Td>
      <Table.Td>{moment(element.date).format("MM-DD-YYYY hh:mm A")}</Table.Td>
      <Table.Td>
        <Button size="xs">Edit</Button>
      </Table.Td>
      <Table.Td>
        <Button color="red" size="xs">
          Delete
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const monthlyRows = (monthlyLogs?.data ?? []).map((element) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element.year}</Table.Td>
      <Table.Td>{element.month}</Table.Td>
      <Table.Td>{element.income ?? 0}</Table.Td>
      <Table.Td>{element.expenses ?? 0}</Table.Td>
      <Table.Td>{element.outcome ?? 0}</Table.Td>
      <Table.Td>{element.isClosed ? "Closed" : "Open"}</Table.Td>
      <Table.Td>{element.transactions ?? element.txCount ?? 0}</Table.Td>
      <Table.Td>
        <Button size="xs">View</Button>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    dispatch(getTransactions({ year: 2026, month: 1, page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <Container size="xl">
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Group my="sm" align="center" justify="space-between">
            <Title>{mode}</Title>
            <Flex gap="xs"></Flex>
            <SegmentedControl
              value={mode}
              color="lime"
              onChange={(value) => handleModeChange(value)}
              data={["This Month", "Monthly"]}
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          {mode === "This Month" ? (
            <Box>
              <ScrollArea h="80vh">
                <Flex direction="column" h="100%">
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Category</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th></Table.Th>
                        <Table.Th></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{thisLogs}</Table.Tbody>
                  </Table>
                </Flex>
              </ScrollArea>
              {transactions.pagination.totalPages > 0 && (
                <Flex justify="flex-end" mt="auto" p="md">
                  <Pagination
                    total={transactions.pagination.totalPages}
                    value={activePage}
                    onChange={(v) => handlePageChange(v)}
                  />
                </Flex>
              )}
            </Box>
          ) : (
            <Box>
              <ScrollArea h="80vh">
                <Flex direction="column" h="100%">
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Year</Table.Th>
                        <Table.Th>Month</Table.Th>
                        <Table.Th>Income</Table.Th>
                        <Table.Th>Expenses</Table.Th>
                        <Table.Th>Outcome</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Transactions</Table.Th>
                        <Table.Th></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{monthlyRows}</Table.Tbody>
                  </Table>
                </Flex>
              </ScrollArea>
              {transactions.pagination.totalPages > 0 && (
                <Flex justify="flex-end" mt="auto" p="md">
                  <Pagination
                    total={transactions.pagination.totalPages}
                    value={activePage}
                    onChange={(v) => handlePageChange(v)}
                  />
                </Flex>
              )}
            </Box>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default LogsPage;
