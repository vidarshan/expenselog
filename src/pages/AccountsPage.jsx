import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import AddAccount from "../components/popups/AddAccount";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, getAccounts } from "../store/slices/accountsSlice";
import EmptyContainer from "../components/EmptyContainer";
import AccountCard from "../components/cards/AccountCard";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet";
import { FiPlus } from "react-icons/fi";

const AccountsPage = () => {
  const dispatch = useDispatch();
  const { loading, accounts } = useSelector((state) => state.accounts);

  const [opened, setOpened] = useState(false);
  const [mode, setMode] = useState("create");
  const [account, setAccount] = useState();

  const handleDelete = async (id) => {
    await dispatch(deleteAccount(id));
  };

  const openCreate = () => {
    setMode("create");
    setAccount(undefined);
    setOpened(true);
  };

  const openEdit = (a) => {
    setMode("edit");
    setAccount(a);
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
    setMode("create");
    setAccount(undefined);
  };

  return (
    <Container size="xl" py="md">
      <Helmet>
        <title>Accounts | ExpenseLog</title>
      </Helmet>
      <AddAccount
        account={account}
        mode={mode}
        setMode={setMode}
        opened={opened}
        onClose={handleClose}
        onSave={() => dispatch(getAccounts())}
      />

      <Stack gap="md">
        <Paper
          withBorder
          radius="1.75rem"
          p="lg"
          style={{
            background:
              "linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0.01))",
          }}
        >
          <Group justify="space-between" align="center">
            <Box>
              <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                Account management
              </Text>
              <Title order={2}>Accounts</Title>
              <Text c="dimmed" size="sm" mt={4}>
                Manage your bank, cash, and credit accounts in one place.
              </Text>
            </Box>

            <Button
              leftSection={<FiPlus />}
              radius="xl"
              size="md"
              onClick={openCreate}
            >
              Create Account
            </Button>
          </Group>
        </Paper>

        {loading ? (
          <Loading title="Loading accounts..." />
        ) : accounts.length > 0 ? (
          <SimpleGrid mt="sm" cols={1}>
            {accounts.map((a) => (
              <AccountCard
                key={a._id}
                account={a}
                onDelete={() => handleDelete(a._id)}
                onEdit={() => openEdit(a)}
                onSelect={() => openEdit(a)}
              />
            ))}
          </SimpleGrid>
        ) : (
          <EmptyContainer message="You have no accounts" />
        )}
      </Stack>
    </Container>
  );
};

export default AccountsPage;
