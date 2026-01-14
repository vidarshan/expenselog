import { Card, Flex, Text, Title } from "@mantine/core";
import React from "react";
import { FcMoneyTransfer } from "react-icons/fc";

const Logo = ({ logoSize = 20, titleSize = 1 }) => {
  return (
    <Card px={0} w="fit-content" radius="md" bg="transparent">
      <Flex direction="row" align="center">
        <FcMoneyTransfer size={logoSize} />
        <Title order={titleSize} fw={500} c="lime" ml="xs">
          ExpenseLog
        </Title>
      </Flex>
    </Card>
  );
};

export default Logo;
