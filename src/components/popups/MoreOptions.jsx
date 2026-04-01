import { ActionIcon, Popover, Box } from "@mantine/core";
import React, { useState } from "react";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

const MoreOptions = ({ options }) => {
  const [opened, setOpened] = useState(false);

  const close = () => setOpened(false);

  return (
    <Popover
      position="bottom-end"
      opened={opened}
      onChange={setOpened}
      withArrow
    >
      <Popover.Target>
        <ActionIcon
          variant="transparent"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
            setOpened((o) => !o);
          }}
        >
          <IoEllipsisVerticalSharp />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Box onClick={(e) => e.stopPropagation()}>
          {typeof options === "function" ? options({ close }) : options}
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};

export default MoreOptions;
