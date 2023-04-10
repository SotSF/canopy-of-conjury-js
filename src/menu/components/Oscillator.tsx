import { useEffect, useMemo, useState } from "react";
import _ from "lodash";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { createStyles, withStyles, Theme } from "@mui/material/styles";

import { IOscillator, IWaveParams, WaveType } from "@/types";
import { Popover } from "./Popover";
import { Slider } from "./Slider";

type WaveImageProps = {
  oscillator: IOscillator;
};

type WaveImageState = {
  points: number[];
  theta: number;
};

const SVG_HEIGHT = 200;
const SVG_WIDTH = 200;

function WaveImage({ oscillator }: WaveImageProps) {
  const [theta, _setTheta] = useState(0);

  const pointsInitial = useMemo(() => {
    // Map the SVG x-coordinate to the wave function's domain of [0, 8 pi]
    const scaleFactor = (Math.PI * 8) / SVG_WIDTH;
    return _.range(SVG_WIDTH).map((x) => {
      const yValue = oscillator.waveFunction(x * scaleFactor);
      return scaleValue(yValue);
    });
  }, [oscillator]);

  const [points, setPoints] = useState(pointsInitial);

  // Update the points every 10ms
  useEffect(() => {
    const interval = setInterval(() => {
      const value = oscillator.sample;
      setPoints(points.slice(1).concat(scaleValue(value)));
    }, 10);
    return () => clearInterval(interval);
  }, [oscillator, points]);

  // Shift the points according to theta
  const sliceIndex = theta % SVG_WIDTH;
  const adjusted = points.slice(sliceIndex).concat(points.slice(0, sliceIndex));
  const [first, ...rest] = adjusted;

  const instructions = [`M 0 ${first}`, ...rest.map((y, x) => `L ${x} ${y}`)];

  return (
    <svg
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
      style={{ backgroundColor: "black" }}
    >
      <path
        d={instructions.join(" ")}
        stroke="green"
        strokeWidth={2}
        fill="none"
      />
    </svg>
  );

  function scaleValue(value: number) {
    return SVG_HEIGHT * (0.5 - value * 0.45);
  }
}

type WavePropsProps = {
  className?: string;
  oscillator: IOscillator;
};

function WaveProps({ className, oscillator }: WavePropsProps) {
  const waveTypes = [
    WaveType.Sine,
    WaveType.Square,
    WaveType.Triangle,
    WaveType.Saw,
  ];

  return (
    <div className={className}>
      <Popover buttonText={WaveType[oscillator.params.type]}>
        <List dense disablePadding>
          {waveTypes.map((type) => (
            <ListItem button key={type}>
              <ListItemText
                primary={WaveType[type]}
                onClick={() => updateWave("type")(type)}
              />
            </ListItem>
          ))}
        </List>
      </Popover>

      <Box component="div" sx={{ marginTop: 1 }}>
        <Slider
          defaults={{}}
          label="Frequency"
          max={2}
          min={0.1}
          onChange={updateWave("frequency")}
          oscillation
          step={0.1}
          value={oscillator.params.frequency}
        />
      </Box>
    </div>
  );

  function updateWave<K extends keyof IWaveParams, V extends IWaveParams[K]>(
    param: K
  ) {
    return (value: V) => {
      oscillator.updateWave({ [param]: value });
    };
  }
}

type OscillatorWidgetProps = {
  buttonText?: string;
  createFn?: () => IOscillator;
  oscillator?: IOscillator;
  onCreate?: (osc: IOscillator) => void;
};

export function OscillatorWidget(props: OscillatorWidgetProps) {
  const { buttonText = "Oscillator", createFn } = props;
  const [oscillator, setOscillator] = useState<IOscillator>();

  return (
    <Popover
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      buttonText={buttonText}
      onOpen={onOpen}
      transparent
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {oscillator ? (
        <Box component="div" sx={{ display: "flex" }}>
          <WaveImage oscillator={oscillator} />
          <Box component="div" sx={{ marginLeft: 1 }}>
            <WaveProps oscillator={oscillator} />
          </Box>
        </Box>
      ) : null}
    </Popover>
  );

  function onOpen() {
    const oscillator = props.oscillator
      ? props.oscillator
      : createFn
      ? createFn()
      : undefined;

    setOscillator(oscillator);
  }
}
