import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isInRange, isNotEmpty, useForm } from "@mantine/form";
import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import AddAccount from "../components/popups/AddAccount";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, getAccounts } from "../store/slices/accountsSlice";
import EmptyContainer from "../components/EmptyContainer";
import AccountCard from "../components/cards/AccountCard";
import Loading from "../components/Loading";

const AccountsPage = () => {
  const dispatch = useDispatch();
  const { loading, error, accounts } = useSelector((state) => state.accounts);
  const [opened, setOpened] = useState(false);

  const handleDelete = async (id) => {
    await dispatch(deleteAccount(id));
  };

  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);

  return (
    <Container size="lg" py="md">
      <AddAccount
        opened={opened}
        onClose={() => setOpened(false)}
        onSave={() => {
          dispatch(getAccounts());
        }}
      />
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Box>
            <Title order={2}>Accounts</Title>
            <Text c="dimmed" size="sm">
              Bank, Credit and Cash
            </Text>
          </Box>
          <Button
            leftSection={<IoAddOutline />}
            onClick={() => setOpened(true)}
          >
            Create Account
          </Button>
        </Group>
      </Stack>
      {loading ? (
        <Loading />
      ) : (
        <>
          {accounts.length > 0 ? (
            <SimpleGrid mt="sm" cols={1}>
              {accounts.map((a) => (
                <AccountCard
                  key={a._id}
                  account={a}
                  onDelete={() => handleDelete(a._id)}
                />
              ))}
            </SimpleGrid>
          ) : (
            <EmptyContainer message="You have no accounts" />
          )}
        </>
      )}
    </Container>
  );
};

export default AccountsPage;
