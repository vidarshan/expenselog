import { Card, Flex, Text, Title } from "@mantine/core";
import React from "react";
import { FcMoneyTransfer } from "react-icons/fc";

const Logo = ({
  logoSize = 20,
  titleSize = 1,
  onClick,
  noMargin = true,
  withTitle = true,
}) => {
  return (
    <Card
      style={{ cursor: "pointer" }}
      onClick={onClick}
      px={0}
      w="fit-content"
      radius="lg"
      bg="transparent"
    >
      <Flex direction="row" align="center">
        <FcMoneyTransfer size={logoSize} />
        {withTitle ? (
          <Title order={titleSize} fw={500} c="lime" ml={noMargin ? 0 : "xs"}>
            ExpenseLog
          </Title>
        ) : null}
      </Flex>
    </Card>
  );
};

export default Logo;
