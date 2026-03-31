import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import moment from "moment";
import {
  IoAddOutline,
  IoArrowDownSharp,
  IoArrowUpSharp,
  IoCalendarOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTransaction,
  getTransactions,
} from "../store/slices/transactionsSlice";
import {
  getMonthOptions,
  getYearOptions,
  months,
} from "../utils/getCurrentPeriod";
import { setMonth, setYear } from "../store/slices/appSlice";
import { getAccounts } from "../store/slices/accountsSlice";
import AddRecord from "../components/popups/AddRecord";
import Loading from "../components/Loading";
import EmptyContainer from "../components/EmptyContainer";

const LogsPage = () => {
  const dispatch = useDispatch();
  const [expenseOpened, setExpenseOpened] = useState(false);
  const [txMode, setTxMode] = useState("create");
  const [selectedTx, setSelectedTx] = useState(null);
  const [activePage, setActivePage] = useState(1);

  const { transactions, loading } = useSelector((state) => state.transactions);
  const { activePeriods } = useSelector((state) => state.logs);
  const { currentYear, currentMonth } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(
      getTransactions({
        year: currentYear,
        month: currentMonth,
        page: activePage,
        limit: 20,
      }),
    );
  }, [activePage, currentMonth, currentYear, dispatch]);

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

  const monthLabel = months()[Number(currentMonth) - 1];
  const totalRows =
    transactions?.pagination?.total || transactions?.data?.length || 0;

  const rows = transactions.data.map((transaction) => (
    <Table.Tr key={transaction._id}>
      <Table.Td>
        <Stack gap={2}>
          <Text fw={700} size="sm">
            {transaction.name}
          </Text>
          <Text size="xs" c="dimmed">
            {moment(transaction.date).format("MMM D, YYYY")} at{" "}
            {transaction.time || "N/A"}
          </Text>
        </Stack>
      </Table.Td>
      <Table.Td>
        {transaction.categoryName ? (
          <Badge variant="dot" color={transaction.categoryColor}>
            {transaction.categoryName}
          </Badge>
        ) : (
          <Text size="sm" c="dimmed">
            Unassigned
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        <Text fw={700}>${Number(transaction.amount || 0).toFixed(2)}</Text>
      </Table.Td>
      <Table.Td>
        {transaction.type === "expense" ? (
          <Badge leftSection={<IoArrowDownSharp />} color="red" variant="light">
            Expense
          </Badge>
        ) : (
          <Badge leftSection={<IoArrowUpSharp />} color="green" variant="light">
            Income
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap" justify="flex-end">
          <Button
            size="xs"
            radius="xl"
            variant="light"
            onClick={() => openEditTx(transaction)}
          >
            Edit
          </Button>
          <Button
            color="red"
            size="xs"
            radius="xl"
            variant="light"
            onClick={() => handleDeleteTx(transaction)}
          >
            Delete
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="md">
      <Helmet>
        <title>Transactions | ExpenseLog</title>
      </Helmet>

      <AddRecord
        expenseOpened={expenseOpened}
        setExpenseOpened={setExpenseOpened}
        mode={txMode}
        transaction={selectedTx}
      />

      <Stack gap="lg">
        <Paper
          withBorder
          radius="1.75rem"
          p="lg"
          style={{
            background:
              "linear-gradient(160deg, rgba(163, 230, 53, 0.12), rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01))",
          }}
        >
          <Group justify="space-between" align="end">
            <Box>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Transaction history
              </Text>
              <Title order={2}>Logs</Title>
              <Text c="dimmed" size="sm" mt={4}>
                Review and manage entries for {monthLabel} {currentYear}.
              </Text>
            </Box>
          </Group>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Paper withBorder radius="xl" p="md">
            <Text size="xs" c="dimmed">
              Period
            </Text>
            <Text fw={700} mt={4}>
              {monthLabel} {currentYear}
            </Text>
          </Paper>
          <Paper withBorder radius="xl" p="md">
            <Text size="xs" c="dimmed">
              Visible records
            </Text>
            <Text fw={700} mt={4}>
              {transactions.data.length}
            </Text>
          </Paper>
          <Paper withBorder radius="xl" p="md">
            <Text size="xs" c="dimmed">
              Total records
            </Text>
            <Text fw={700} mt={4}>
              {totalRows}
            </Text>
          </Paper>
        </SimpleGrid>

        <Paper withBorder radius="1.5rem" p="md">
          <Group justify="space-between" align="end" wrap="wrap">
            <Box>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Filters
              </Text>
              <Text fw={700}>Choose a month to inspect</Text>
            </Box>

            <Flex gap="sm" wrap="wrap">
              <Select
                radius="xl"
                value={currentMonth}
                leftSection={<IoCalendarOutline />}
                placeholder="Select Month"
                onChange={(value) => {
                  if (!value) return;
                  setActivePage(1);
                  dispatch(setMonth(value));
                }}
                data={getMonthOptions(activePeriods, currentYear)}
                allowDeselect={false}
              />
              <Select
                radius="xl"
                value={currentYear}
                leftSection={<IoCalendarOutline />}
                placeholder="Select Year"
                onChange={(value) => {
                  if (!value) return;
                  setActivePage(1);
                  dispatch(setYear(value));
                }}
                data={getYearOptions(activePeriods)}
                allowDeselect={false}
              />
            </Flex>
          </Group>
        </Paper>

        {loading ? (
          <Loading title="Loading logs" />
        ) : transactions.data.length === 0 ? (
          <Paper withBorder radius="1.5rem" p="lg">
            <EmptyContainer message="No transactions for this period" />
          </Paper>
        ) : (
          <Paper withBorder radius="1.5rem" p="md">
            <Group justify="space-between" mb="md">
              <Group>
                <IoDocumentTextOutline size={20} />
                <Box>
                  <Text fw={700}>Transaction Table</Text>
                  <Text size="sm" c="dimmed">
                    Clean review of entries, amounts, dates, and actions.
                  </Text>
                </Box>
              </Group>
              <Badge variant="light">{totalRows} total</Badge>
            </Group>

            <ScrollArea>
              <Table highlightOnHover verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Entry</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>

            {transactions.pagination.totalPages > 1 ? (
              <Flex justify="flex-end" mt="md">
                <Pagination
                  total={transactions.pagination.totalPages}
                  value={activePage}
                  onChange={setActivePage}
                />
              </Flex>
            ) : null}
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default LogsPage;
