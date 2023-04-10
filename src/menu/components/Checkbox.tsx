import * as React from "react";
import CheckboxComponent from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

type CheckboxProps = {
  checked: boolean;
  label: string;
  onChange(checked: boolean): void;
};

export function Checkbox(props: CheckboxProps) {
  const { checked, label, onChange } = props;
  return (
    <div>
      <FormControlLabel
        label={label}
        control={
          <CheckboxComponent
            checked={checked}
            color="primary"
            onChange={() => onChange(!checked)}
          />
        }
      />
    </div>
  );
}
