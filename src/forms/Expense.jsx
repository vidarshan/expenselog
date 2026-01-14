import { Modal } from "@mantine/core";
import React from "react";

const Expense = ({ opened, close, title }) => {
  return (
    <Modal opened={opened} onClose={close} title={title} centered>
      {/* Modal content */}
    </Modal>
  );
};

export default Expense;
