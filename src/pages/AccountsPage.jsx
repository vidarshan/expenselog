import {
  Box,
  Button,
  Container,
  Group,
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
    <Container size="lg" py="md">
      <AddAccount
        account={account}
        mode={mode}
        setMode={setMode}
        opened={opened}
        onClose={handleClose}
        onSave={() => dispatch(getAccounts())}
      />

      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Box>
            <Title order={2}>Accounts</Title>
            <Text c="dimmed" size="sm">
              Bank, Credit and Cash
            </Text>
          </Box>

          <Button leftSection={<IoAddOutline />} onClick={openCreate}>
            Create Account
          </Button>
        </Group>

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
