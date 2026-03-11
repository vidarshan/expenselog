import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Pagination,
  ScrollArea,
  SegmentedControl,
  Select,
  Table,
  Text,
  Title,
} from "@mantine/core";

import moment from "moment";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteTransaction,
  getTransactions,
} from "../store/slices/transactionsSlice";
import {
  IoArrowDownSharp,
  IoArrowUpSharp,
  IoCalendarOutline,
  IoGridOutline,
} from "react-icons/io5";
import {
  getMonthOptions,
  getYearOptions,
  months,
} from "../utils/getCurrentPeriod";
import { setMonth, setYear } from "../store/slices/appSlice";
import { getAccounts } from "../store/slices/accountsSlice";
import AddRecord from "../components/popups/AddRecord";
import { useNavigate } from "react-router-dom";

const LogsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [expenseOpened, setExpenseOpened] = useState(false);
  const [txMode, setTxMode] = useState("create");
  const [selectedTx, setSelectedTx] = useState(null);
  const { transactions } = useSelector((state) => state.transactions);
  const { monthlyLogs } = useSelector((state) => state.logs);

  const { currentYear, currentMonth } = useSelector((state) => state.app);

  const [mode] = useState("This Month");
  const [activePage, setActivePage] = useState(1);

  const openEditTx = (tx) => {
    setTxMode("edit");
    setSelectedTx(tx);
    setExpenseOpened(true);
  };

  const handleDeleteTx = async (tx) => {
    await dispatch(deleteTransaction(tx._id)).unwrap();
    await dispatch(getAccounts());
    await dispatch(
      getTransactions({
        year: currentYear,
        month: currentMonth,
        page: activePage,
        limit: 20,
      }),
    );
  };

  const handlePageChange = (value) => {
    setActivePage(value);
    dispatch(
      getTransactions({
        year: currentYear,
        month: currentMonth,
        page: value,
        limit: 20,
      }),
    );
  };

  const thisLogs = transactions.data.map((element) => (
    <Table.Tr key={element._id}>
      <Table.Td>{element.categoryName}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.amount}</Table.Td>
      <Table.Td>
        {element.type === "expense" ? (
          <Badge leftSection={<IoArrowDownSharp />} color="red" variant="light">
            Expense
          </Badge>
        ) : (
          <Badge leftSection={<IoArrowUpSharp />} color="green" variant="light">
            Income
          </Badge>
        )}
      </Table.Td>
      {console.log(element)}
      <Table.Td>
        {moment(element.date).format("MM-DD-YYYY")} {element.time}
      </Table.Td>
      <Table.Td>
        <Button size="xs" onClick={() => openEditTx(element)}>
          Edit
        </Button>
      </Table.Td>
      <Table.Td>
        <Button color="red" size="xs" onClick={() => handleDeleteTx(element)}>
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
    dispatch(
      getTransactions({
        year: currentYear,
        month: currentMonth,
        page: 1,
        limit: 20,
      }),
    );
  }, [dispatch, currentMonth, currentYear]);

  return (
    <Container size="xl">
      <AddRecord
        expenseOpened={expenseOpened}
        setExpenseOpened={setExpenseOpened}
        mode={txMode}
        transaction={selectedTx}
      />
      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Group my="sm" align="center" justify="space-between">
            <Box>
              <Title order={2}>{mode}</Title>
              <Text c="dimmed" size="sm">
                Logs for {months()[currentMonth - 1]} {currentYear}
              </Text>
            </Box>
            <Flex gap="xs"></Flex>
            <Flex gap="xs">
              <Button
                leftSection={<IoGridOutline />}
                onClick={() => navigate(`/categories`)}
              >
                Categories
              </Button>
              <Select
                radius="lg"
                value={currentMonth}
                leftSection={<IoCalendarOutline />}
                placeholder="Select Month"
                onChange={(value) => dispatch(setMonth(value))}
                data={getMonthOptions()}
                allowDeselect={false}
              />
              <Select
                radius="lg"
                value={currentYear}
                leftSection={<IoCalendarOutline />}
                placeholder="Select Year"
                onChange={(value) => dispatch(setYear(value))}
                data={getYearOptions()}
                allowDeselect={false}
              />
            </Flex>
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
                        <Table.Th>Category</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>Type</Table.Th>
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
