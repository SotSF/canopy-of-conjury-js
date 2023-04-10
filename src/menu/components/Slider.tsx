import { useEffect, useState } from "react";
import classNames from "classnames";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { createStyles, styled, Theme } from "@mui/material/styles";
import MaterialSlider from "@mui/material/Slider";

import { MaybeOscillator, IWaveParams } from "@/types";
import {
  NumericOscillator,
  isOscillatorWrapper,
  Oscillator,
} from "@/patterns/utils";
import { OscillatorWidget } from "./Oscillator";
import { Popover } from "./Popover";

type SliderOscillatorProps = {
  defaults: Partial<IWaveParams>;
  max: number;
  min: number;
  oscillation: boolean;
  updateValue(osc: NumericOscillator): void;
  value: MaybeOscillator<number>;
};

type SliderProps = {
  defaults: Partial<IWaveParams>;
  label: string;
  value: MaybeOscillator<number>;
  min?: number;
  max?: number;
  step?: number;
  onChange(value: MaybeOscillator<number>): void;
  oscillation: boolean;
};

export function Slider(props: SliderProps) {
  const { label, min = 1, max = 10, onChange, step = 1 } = props;
  const [value, setValue] = useState(props.value);

  // If the value is changed externally, update the state
  useEffect(() => {
    if (props.value !== value) setValue(props.value);
  }, [props.value, value]);

  const actual = isOscillatorWrapper(value) ? value.value() : value;

  return (
    <Popover
      buttonText={label}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PopoverProps={{
        PaperProps: { sx: { display: "flex" } },
      }}
      transparent
    >
      <Card
        sx={{
          height: "200px",
          padding: "12px 0 10px 8px",
          overflow: "visible",
        }}
      >
        <MaterialSlider
          onChange={(_, value) => updateValue(value as number)}
          marks={[
            { value: min, label: min },
            { value: max, label: max },
          ]}
          max={max}
          min={min}
          step={-step}
          value={actual}
          orientation="vertical"
          valueLabelDisplay="auto"
        />
      </Card>

      <Box component="div" sx={{ marginLeft: 1 }}>
        <SliderOscillator
          max={max}
          min={min}
          oscillation={props.oscillation}
          defaults={props.defaults}
          value={value}
          updateValue={updateValue}
        />
      </Box>
    </Popover>
  );

  function updateValue(value: MaybeOscillator<number>) {
    onChange(value);
    setValue(value);
  }
}

function SliderOscillator(props: SliderOscillatorProps) {
  const { defaults, max, min, oscillation, updateValue, value } = props;
  if (!oscillation) return null;

  const oscillator = isOscillatorWrapper(value) ? value.oscillator : undefined;

  const createFn = () => {
    const oscillator = new Oscillator(defaults);
    updateValue(new NumericOscillator(oscillator, min, max));
    return oscillator;
  };

  return <OscillatorWidget createFn={createFn} oscillator={oscillator} />;
}
