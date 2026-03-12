import { useState } from "react";
import {
  NAVBAR_HEIGHT,
  recentTransactions,
  yearlyMonthlyReports,
} from "../data/mockdata";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  Pagination,
  Radio,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IoCalendarClearOutline,
  IoFilterOutline,
  IoTrashOutline,
  IoTrendingDownOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { nanoid } from "nanoid";
import ContributionChart from "../components/charts/ContributionChart";
import OverviewCard from "../components/OverviewCard";
import ComparisonChart from "../components/charts/ComparisonChart";
import moment from "moment";
import YearAndMonthly from "../components/tables/YearAndMonthly";
import { useNavigate } from "react-router-dom";
import { appData } from "../data/appData";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [incomeOptions, setIncomeOptions] = useState("fixed");
  const [incomeSources, setIncomeSources] = useState([
    {
      id: 1,
      name: "",
      salary: 0,
    },
  ]);

  const [recordOpened, setRecordOpened] = useState(false);

  const [year, setYear] = useState("2025");

  const removeIncomeSource = (id) => {
    if (incomeSources.length > 1) {
      const newIncomeList = incomeSources.filter((i) => {
        return i.id !== id;
      });
      setIncomeSources(newIncomeList);
    }
  };

  const addIncomeSource = () => {
    const newIncomeList = [
      ...incomeSources,
      {
        id: nanoid(),
        name: "",
        salary: 0,
      },
    ];
    setIncomeSources(newIncomeList);
  };

  const editIncomeSource = (id, newName, newSalary) => {
    setIncomeSources((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: newName, salary: newSalary } : item,
      ),
    );
  };

  const rows = yearlyMonthlyReports.map((yearReport) => {
    if (yearReport.year.toString() === year) {
      return yearReport.months.map(({ month, income, logs }) => {
        return (
          <Table.Tr
            key={month + "$" + year}
            onClick={() => navigate(`/reports/${year}/${month.toLowerCase()}`)}
          >
            <Table.Td>{year}</Table.Td>
            <Table.Td>{month}</Table.Td>
            <Table.Td>${income}</Table.Td>
            <Table.Td>${income}</Table.Td>
            <Table.Th>
              <IoTrendingUpOutline />
            </Table.Th>
            <Table.Th>
              <Badge variant="light" color="red">
                Closed
              </Badge>
            </Table.Th>
            <Table.Td>{logs}</Table.Td>
            <Table.Td>
              <Button size="xs" variant="subtle" fullWidth>
                View report
              </Button>
            </Table.Td>
          </Table.Tr>
        );
      });
    }
  });

  const yearRows = appData.map(({ year, summary }) => {
    return (
      <Table.Tr
        key={year + "$" + year}
        onClick={() => navigate(`/reports/${year}`)}
      >
        <Table.Td>{year}</Table.Td>
        <Table.Td>${summary.income}</Table.Td>
        <Table.Td>${summary.expenses}</Table.Td>
        <Table.Td>
          {" "}
          {summary.expenses > summary.income ? (
            <IoTrendingDownOutline />
          ) : (
            <IoTrendingUpOutline />
          )}
        </Table.Td>
        <Table.Th>
          {summary.isClosed ? (
            <Badge variant="light" color="red">
              Closed
            </Badge>
          ) : (
            <Badge variant="light" color="green">
              Open
            </Badge>
          )}
        </Table.Th>
        <Table.Th>{summary.transactionCount}</Table.Th>
        <Table.Td></Table.Td>
        <Table.Td>
          <Button size="xs" variant="subtle" fullWidth>
            View report
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Container size="xl">
      <Modal
        opened={recordOpened}
        onClose={() => setRecordOpened(false)}
        title="How do you usually get paid?"
        closeOnClickOutside={false}
        centered
      >
        <Radio.Group
          name="incomeTypes"
          defaultValue={incomeOptions}
          onChange={setIncomeOptions}
          withAsterisk
        >
          <Group mt="xs">
            <Radio
              value="fixed"
              label="Fixed salary (same amount every month)"
            />
            <Radio
              value="variable"
              label="Variable income (freelance / hourly / tips)"
            />
          </Group>
        </Radio.Group>
        <Divider my="md" />
        {incomeOptions === "fixed" ? (
          <NumberInput placeholder="Enter your salary" />
        ) : (
          <Card withBorder>
            {incomeSources.map(({ id, name, salary }) => {
              return (
                <Flex align="center" key={id} mb="xs" gap="xs" grow>
                  <TextInput
                    value={name}
                    placeholder="Source name"
                    mr="xs"
                    onChange={(e) =>
                      editIncomeSource(id, e.target.value, salary)
                    }
                  />
                  <NumberInput
                    value={salary.toString()}
                    placeholder="Salary"
                    onChange={(e) => editIncomeSource(id, name, e.target.value)}
                    mr="xs"
                  />
                  <ActionIcon
                    color="red"
                    onClick={() => removeIncomeSource(id)}
                    variant="light"
                  >
                    <IoTrashOutline />
                  </ActionIcon>
                </Flex>
              );
            })}
            <Button mt="xs" variant="light" onClick={addIncomeSource} fullWidth>
              Add Source
            </Button>
          </Card>
        )}
        <Flex justify="flex-end" mt="md">
          <Button variant="light" mr="xs">
            Cancel
          </Button>
          <Button>Create</Button>
        </Flex>
      </Modal>

      <Grid>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <OverviewCard />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <ContributionChart />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Card h="100%" shadow="xl" withBorder>
            <Flex>
              <Text fw={700}>Most Recent transactions</Text>
            </Flex>
            {recentTransactions
              ?.slice(0, 5)
              .map(({ title, amount, category, date }, index) => (
                <Card
                  key={index + "@" + title}
                  mt="xs"
                  radius="lg"
                  style={{ cursor: "pointer" }}
                  withBorder
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <Text fw={600} size="sm">
                        {title}
                      </Text>
                      <Badge ml="xs" variant="light">
                        {category}
                      </Badge>
                    </Flex>
                    <Text></Text>
                    <Text fw={600} size="sm">
                      ${amount} | {moment(date).fromNow()}
                    </Text>
                  </Flex>
                </Card>
              ))}
          </Card>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <ComparisonChart />
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Card h="100%" withBorder>
            <Flex mb="xl" justify="space-between" align="center">
              <Text fw={700}>Past months</Text>
              <Flex gap="xs">
                <Select
                  value={year}
                  onChange={setYear}
                  leftSection={<IoCalendarClearOutline />}
                  data={["2025", "2024", "2023", "2022"]}
                />
                <Select
                  leftSection={<IoFilterOutline />}
                  placeholder="Apply Filters"
                  data={["Most Recent", "Most Gain", "Most Loss", "Break Even"]}
                />
              </Flex>
            </Flex>
            <Grid>
              <YearAndMonthly rows={rows} />
            </Grid>
            <Flex justify="center">
              <Pagination mt="md" total={10} />
            </Flex>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Card h="100%" withBorder>
            <Flex mb="xl" justify="space-between" align="center">
              <Text fw={700}>Yearly</Text>
              <Flex gap="xs">
                <Select
                  value={year}
                  onChange={setYear}
                  leftSection={<IoCalendarClearOutline />}
                  data={["2025", "2024", "2023", "2022"]}
                />
                <Select
                  leftSection={<IoFilterOutline />}
                  placeholder="Apply Filters"
                  data={["Most Recent", "Most Gain", "Most Loss", "Break Even"]}
                />
              </Flex>
            </Flex>
            <YearAndMonthly mode="year" rows={yearRows} />
            <Flex justify="center">
              <Pagination mt="md" total={3} />
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
