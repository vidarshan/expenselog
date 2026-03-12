import React, { useState } from "react";
import { NAVBAR_HEIGHT } from "../data/mockdata";
import {
  ActionIcon,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  Radio,
  TextInput,
  Title,
} from "@mantine/core";
import { nanoid } from "nanoid";
import {
  IoAddSharp,
  IoBriefcaseOutline,
  IoCashOutline,
  IoCheckmark,
  IoCloseOutline,
  IoLockClosedOutline,
  IoMailOpenOutline,
  IoTextOutline,
  IoTrashOutline,
} from "react-icons/io5";

const ProfilePage = () => {
  const [incomeOptions, setIncomeOptions] = useState("fixed");
  const [incomeSources, setIncomeSources] = useState([
    {
      id: 1,
      name: "",
      salary: 0,
    },
  ]);
  const [deleteConfirmationOpened, setDeleteConfirmationOpened] =
    useState(false);

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

  return (
    <Container size="xl" pt={NAVBAR_HEIGHT + 32}>
      <Modal
        opened={deleteConfirmationOpened}
        onClose={setDeleteConfirmationOpened}
        title="Delete your account?"
        centered
      >
        Proceeding will delete all your data and this action is irreversible.
        <Group mt="md" justify="flex-end">
          <Button
            color="gray"
            leftSection={<IoCloseOutline />}
            variant="filled"
          >
            Cancel
          </Button>
          <Button
            leftSection={<IoTrashOutline />}
            color="red"
            onClick={() => setDeleteConfirmationOpened(false)}
          >
            Delete
          </Button>
        </Group>
      </Modal>

      <Card withBorder>
        <Title order={2}>Personal Information</Title>
        <Divider my="md" />
        <TextInput
          leftSection={<IoMailOpenOutline />}
          label="Email"
          placeholder="Type in your email"
        />
        <TextInput
          leftSection={<IoTextOutline />}
          mt="md"
          label="Name"
          placeholder="Type in your name"
        />
        <PasswordInput
          leftSection={<IoLockClosedOutline />}
          mt="md"
          label="Password"
          placeholder="Type in your password"
        />
        <Group mt="xl" justify="flex-end">
          <Button leftSection={<IoCheckmark />}>Update Information</Button>
          <Button
            leftSection={<IoTrashOutline />}
            color="red"
            onClick={() => setDeleteConfirmationOpened(true)}
          >
            Delete Account
          </Button>
        </Group>
      </Card>
      <Card mt="xl" withBorder>
        <Title order={2}>Financial Information</Title>
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
          <NumberInput
            leftSection={<IoCashOutline />}
            placeholder="Enter your salary"
          />
        ) : (
          <Card withBorder>
            {incomeSources.map(({ id, name, salary }) => {
              return (
                <Flex mb="sm" align="center">
                  <TextInput
                    w="100%"
                    leftSection={<IoBriefcaseOutline />}
                    value={name}
                    placeholder="Source name"
                    mr="xs"
                    onChange={(e) =>
                      editIncomeSource(id, e.target.value, salary)
                    }
                  />
                  <NumberInput
                    w="100%"
                    leftSection={<IoCashOutline />}
                    value={salary.toString()}
                    placeholder="Salary"
                    onChange={(e) => editIncomeSource(id, name, e.target.value)}
                    mr="xs"
                  />
                  <ActionIcon
                    color="red"
                    onClick={() => removeIncomeSource(id)}
                    variant="filled"
                  >
                    <IoTrashOutline />
                  </ActionIcon>
                </Flex>
              );
            })}

            <Button
              mt="xs"
              leftSection={<IoAddSharp />}
              variant="filled"
              onClick={addIncomeSource}
              fullWidth
            >
              Add Source
            </Button>
          </Card>
        )}
        <Group mt="xl" justify="flex-end">
          <Button leftSection={<IoCheckmark />}>Update Information</Button>
        </Group>
      </Card>
    </Container>
  );
};

export default ProfilePage;
