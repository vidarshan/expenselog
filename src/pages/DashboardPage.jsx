import React, { useState } from "react";
import { NAVBAR_HEIGHT, yearlyMonthlyReports } from "../data/mockdata";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  Pagination,
  Radio,
  SegmentedControl,
  Select,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import Expense from "../forms/Expense";
import {
  IoArrowDown,
  IoArrowUp,
  IoBagHandleOutline,
  IoBriefcaseOutline,
  IoCalendarClearOutline,
  IoCashOutline,
  IoEllipsisVerticalOutline,
  IoFastFoodOutline,
  IoFilterOutline,
  IoHomeOutline,
  IoLayersOutline,
  IoListOutline,
  IoRemoveOutline,
  IoSearch,
  IoTimeOutline,
  IoTrainOutline,
  IoTrashOutline,
  IoTriangle,
  IoTriangleOutline,
} from "react-icons/io5";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { categoryIcons, categoryTabs } from "../assets/dynamicIcons";
import { PieChart } from "@mantine/charts";
import MonthCard from "../components/MonthCard";
import { nanoid } from "nanoid";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("finance");
  const [incomeOptions, setIncomeOptions] = useState("fixed");
  const [incomeSources, setIncomeSources] = useState([
    {
      id: 1,
      name: "",
      salary: 0,
    },
  ]);
  const [categoryOpened, setCategoryOpened] = useState(false);
  const [recordOpened, setRecordOpened] = useState(false);

  const [year, setYear] = useState("2025");

  const iconProps = {
    style: { display: "block" },
    size: 20,
  };

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
        item.id === id ? { ...item, name: newName, salary: newSalary } : item
      )
    );
  };

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
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

      <Modal
        opened={categoryOpened}
        onClose={() => setCategoryOpened(false)}
        title="Add Category"
        centered
        closeOnClickOutside={false}
      >
        <TextInput
          mt="md"
          label="Category Name"
          placeholder="Enter Cateogory Name"
        />
        <Text mt="lg" size="sm" fw={500}>
          Category Icon
        </Text>
        <Tabs
          mt="xs"
          orientation="vertical"
          variant="pills"
          value={activeTab}
          onChange={setActiveTab}
        >
          <Tabs.List>
            {categoryTabs.map(({ value, label, Icon }) => (
              <Tabs.Tab
                key={value}
                value={value}
                leftSection={<Icon size={16} />}
              >
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel ml="xs" value={activeTab}>
            {" "}
            {/* or the category value */}
            <Flex wrap="wrap" gap="sm">
              {categoryIcons
                .filter((icon) => icon.category === activeTab)
                .map(({ key, label, Icon }) => (
                  <ActionIcon
                    key={key}
                    variant="light"
                    size="lg"
                    aria-label={label}
                  >
                    <Icon />
                  </ActionIcon>
                ))}
            </Flex>
          </Tabs.Panel>
        </Tabs>

        <Flex justify="flex-end" mt="md">
          <Button variant="light" mr="xs">
            Cancel
          </Button>
          <Button>Create</Button>
        </Flex>
      </Modal>
      {/* <Expense
        closeExpenses={() => setExpenseOpened(true)}
        openedExpenses={expenseOpened}
        title="Add Expense"
      /> */}
      <Card>
        <Flex align="center" justify="space-between">
          <Flex gap="xs">
            <Card withBorder>
              <Text fw={600} c="cyan">
                Current Balance
              </Text>
              <Title c="cyan">$4890.56</Title>
            </Card>
            <Card withBorder>
              <Text fw={600} c="green">
                Income
              </Text>
              <Title c="green">$1250.78</Title>
            </Card>
            <Card withBorder>
              <Text fw={600} c="red">
                Expenses
              </Text>
              <Title c="red">$675.32</Title>
            </Card>
          </Flex>
          {/* <Flex direction="column">
            <Button
              leftSection={<IoListOutline />}
              onClick={() => setRecordOpened(true)}
            >
              Add Financial Information
            </Button>
            <Button
              leftSection={<IoListOutline />}
              mt="xs"
              onClick={() => setExpenseOpened(true)}
            >
              Add Record
            </Button>
            <Button
              leftSection={<IoLayersOutline />}
              mt="xs"
              onClick={() => setCategoryOpened(true)}
            >
              Add Category
            </Button>
          </Flex> */}
        </Flex>
      </Card>
      <Grid mt="md">
        <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Card>
            <Title order={2}>Quick Overview</Title>
            <PieChart
              withLabelsLine
              labelsPosition="outside"
              labelsType="percent"
              withLabels
              data={[
                { name: "USA", value: 400, color: "indigo.6" },
                { name: "India", value: 300, color: "yellow.6" },
                { name: "Japan", value: 300, color: "teal.6" },
                { name: "Other", value: 200, color: "gray.6" },
              ]}
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Card h="100%">
            <Flex>
              <Title order={2}>Recent Transactions</Title>
            </Flex>
            <Card mt="xs" radius="lg" style={{ cursor: "pointer" }} withBorder>
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Text fw={600} size="lg">
                    Dinner last night
                  </Text>
                  <Badge ml="xs" variant="light">
                    Food
                  </Badge>
                </Flex>
                <Text fw={700}>$40.42</Text>
              </Flex>
            </Card>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Card h="100%">
            <Flex mb="xl" justify="space-between" align="center">
              <Title order={2}>Monthly Overview</Title>
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
            {/* {yearlyMonthlyReports.map(
              ({ id, month, income, logs, isCurrent }) => {
                console.log(year);
                return (
                  <MonthCard
                    key={id}
                    month={month}
                    amount={income}
                    logs={logs}
                    isCurrent={isCurrent}
                  />
                );
              }
            )} */}
            {yearlyMonthlyReports.map((yearReport) => {
              console.log(yearReport);
              if (yearReport.year.toString() === year) {
                return yearReport.months.map(({ month, income, logs }) => {
                  return (
                    <MonthCard
                      key={yearReport.year.toString() + "-" + month}
                      month={month}
                      year={yearReport.year.toString()}
                      amount={income}
                      logs={logs}
                      //isCurrent={isCurrent}
                    />
                  );
                });
              }
            })}
            <Flex justify="center">
              <Pagination mt="md" total={10} />
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
