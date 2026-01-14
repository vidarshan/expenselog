import React, { useState } from "react";
import { NAVBAR_HEIGHT } from "../data/mockdata";
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Modal,
  Select,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Expense from "../forms/Expense";
import {
  IoArrowDown,
  IoArrowUp,
  IoBagHandleOutline,
  IoBriefcaseOutline,
  IoCashOutline,
  IoFastFoodOutline,
  IoHomeOutline,
  IoSearch,
  IoTimeOutline,
  IoTrainOutline,
} from "react-icons/io5";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { categoryIcons, categoryTabs } from "../assets/dynamicIcons";

const DashboardPage = () => {
  const [expenseOpened, setExpenseOpened] = useState(false);
  const [activeTab, setActiveTab] = useState("finance");
  const [categoryOpened, setCategoryOpened] = useState(true);
  const [value, setValue] = useState(null);

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
      <Modal
        opened={expenseOpened}
        onClose={() => setExpenseOpened(false)}
        title="Add Record"
        centered
        closeOnClickOutside={false}
      >
        <Tabs mt="xs" variant="pills" defaultValue="expense">
          <Tabs.List grow>
            <Tabs.Tab value="expense" leftSection={<IoArrowDown />}>
              Expense
            </Tabs.Tab>
            <Tabs.Tab value="income" leftSection={<IoArrowUp />}>
              Income
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="expense">
            <TextInput mt="md" label="Amount" placeholder="Enter Amount" />
            <Select
              mt="sm"
              label="Category"
              placeholder="Select Category"
              data={["Food", "Transport", "Shopping", "Bills"]}
            />
            <DatePickerInput
              mt="sm"
              label="Date"
              placeholder="Select Date"
              value={value}
              onChange={setValue}
            />
            <Select
              mt="sm"
              label="Payment Method"
              placeholder="Select Method"
              data={["Cash", "Card", "Bank", "Other"]}
            />
            <Textarea
              mt="sm"
              label="Notes"
              placeholder="Add any notes here..."
            />
          </Tabs.Panel>

          <Tabs.Panel value="income">
            <TextInput mt="md" label="Amount" placeholder="Enter Amount" />
            <Select
              mt="sm"
              label="Category"
              placeholder="Select Category"
              data={["Food", "Transport", "Shopping", "Bills"]}
            />
            <DatePickerInput
              mt="sm"
              label="Date"
              placeholder="Select Date"
              value={value}
              onChange={setValue}
            />
            <Select
              mt="sm"
              label="Payment Method"
              placeholder="Select Method"
              data={["Cash", "Card", "Bank", "Other"]}
            />
            <Textarea
              mt="sm"
              label="Notes"
              placeholder="Add any notes here..."
            />
          </Tabs.Panel>
        </Tabs>
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
      <Button onClick={() => setExpenseOpened(true)}>Add Record</Button>
      <Button onClick={() => setCategoryOpened(true)}>Add Category</Button>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, veritatis?
      Ea, aut fugit quisquam eveniet id debitis dolores temporibus quaerat eius
      voluptatibus dolor ducimus saepe earum, blanditiis sint provident! Sequi
      fugiat, est dolor accusantium provident maxime nihil esse ipsa dolorem
      iusto qui facere porro quo blanditiis et voluptatum nobis. Commodi
      similique cum explicabo ipsum voluptatem in voluptates architecto adipisci
      repellendus aperiam excepturi fuga expedita unde dolorum iure
      exercitationem maxime illo repellat eum quas voluptas molestias, error
      eaque? Dignissimos molestias mollitia ex, maxime dolor doloremque neque
      consequatur rerum aut quo fugiat ab ipsa rem? Laudantium nam aut expedita
      quas dolore voluptas!
    </Container>
  );
};

export default DashboardPage;
