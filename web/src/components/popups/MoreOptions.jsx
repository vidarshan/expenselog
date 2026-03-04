import { ActionIcon, Popover } from "@mantine/core";
import React, { useState } from "react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

const MoreOptions = ({ options }) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      position="bottom-end"
      opened={opened}
      onChange={setOpened}
      withArrow
    >
      <Popover.Target>
        <ActionIcon
          variant="light"
          color="gray"
          onClick={() => setOpened((o) => !o)}
        >
          <IoEllipsisVerticalSharp />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>{options}</Popover.Dropdown>
    </Popover>
  );
};

export default MoreOptions;
