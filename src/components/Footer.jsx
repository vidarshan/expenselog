import { Box, Divider, Flex, Group, Text } from "@mantine/core";
import React from "react";
import Logo from "./Logo";
import {
  AiOutlineGithub,
  AiOutlineInstagram,
  AiOutlineX,
} from "react-icons/ai";

const Footer = () => {
  return (
    <Box component="footer" align="center" justify="space-between" px="md">
      <Flex align="center" justify='space-between'>
        <Logo logoSize={20} titleSize={5} />

        <Group spacing="md">
          <AiOutlineX />
          <AiOutlineInstagram />
          <AiOutlineGithub />
        </Group>
      </Flex>
    </Box>
  );
};

export default Footer;
