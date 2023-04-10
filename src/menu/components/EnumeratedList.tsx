import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { EnumType } from "@/types";
import { Popover } from "./Popover";

type EnumeratedListProps = {
  enumeration: EnumType;
  onChange(n: number): void;
  value: number;
};

export function EnumeratedList(props: EnumeratedListProps) {
  const { enumeration, onChange, value } = props;
  const [selection, setSelection] = useState(enumeration.value(value));

  return (
    <Popover buttonText={selection}>
      <List dense disablePadding>
        {enumeration.values().map((value) => (
          <ListItemButton key={value}>
            <ListItemText
              primary={value}
              onClick={() => {
                setSelection(selection);
                onChange(enumeration.index(selection));
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Popover>
  );
}
