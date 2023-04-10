import * as React from "react";
import { HuePicker } from "react-color";
import Box from "@mui/material/Box";

import { Color, RGB } from "@/colors";
import { MaybeOscillator, IWaveParams } from "@/types";
import {
  ColorOscillator,
  isOscillatorWrapper,
  Oscillator,
} from "@/patterns/utils";
import { OscillatorWidget } from "./Oscillator";
import { Popover } from "./Popover";

type ColorPickerProps = {
  defaults: Partial<IWaveParams>;
  color?: MaybeOscillator<Color>;
  onChange: (color: MaybeOscillator<Color>) => void;
  oscillation: boolean;
};

type ColorOscillatorWidgetProps = Omit<ColorPickerProps, "color"> & {
  color: MaybeOscillator<Color>;
};

export const ColorPicker = (props: ColorPickerProps) => {
  const { defaults, onChange, oscillation } = props;
  const [color, setColor] = React.useState(props.color || RGB.random());
  const actual = isOscillatorWrapper(color) ? color.value() : color;

  return (
    <Popover
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      buttonColor={actual}
      buttonText="Color"
      PopoverProps={{ sx: { paddingLeft: 1, width: "200px" } }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transparent
    >
      <HuePicker
        color={actual}
        onChangeComplete={({ rgb }) =>
          updateColor(new RGB(rgb.r, rgb.g, rgb.b))
        }
      />

      <Box component="div" sx={{ marginTop: 1 }}>
        <ColorOscillatorWidget
          color={color}
          onChange={updateColor}
          oscillation={oscillation}
          defaults={defaults}
        />
      </Box>
    </Popover>
  );

  function updateColor(color: MaybeOscillator<Color>) {
    setColor(color);
    onChange(color);
  }
};

function ColorOscillatorWidget(props: ColorOscillatorWidgetProps) {
  const { color, oscillation, onChange } = props;
  if (!oscillation) return null;

  const oscillator = isOscillatorWrapper(color) ? color.oscillator : undefined;

  const createFn = () => {
    const defaults = Object.assign({ frequency: 0.25 }, props.defaults);
    const oscillator = new Oscillator(defaults);
    onChange(new ColorOscillator(oscillator));
    return oscillator;
  };

  return <OscillatorWidget createFn={createFn} oscillator={oscillator} />;
}
