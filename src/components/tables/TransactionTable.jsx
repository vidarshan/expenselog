import { ActionIcon, Card, Table } from "@mantine/core";
import React from "react";
import { transactions } from "../../data/mockdata";
import { IoChatbubbleOutline } from "react-icons/io5";

const TransactionTable = () => {
  const rows = transactions.map(
    ({ title, amount, category, date, paymentMethod, notes }, index) => (
      <Table.Tr key={index + "=" + amount}>
        <Table.Td>{title}</Table.Td>
        <Table.Td>{amount}</Table.Td>
        <Table.Td>{category}</Table.Td>
        <Table.Td>{date}</Table.Td>
        <Table.Td>{paymentMethod}</Table.Td>
        <Table.Td>
          <ActionIcon>
            <IoChatbubbleOutline />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    )
  );

  return (
    <Card h="100%" shadow="xl" withBorder>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Transaction</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Payment Method</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
};

export default TransactionTable;
