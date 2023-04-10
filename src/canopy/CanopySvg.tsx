import { useMemo, useState } from "react";
import _ from "lodash";

import { combine } from "@/colors";
import { CanopyInterface, LedInterface, PatternInstance } from "@/types";
import { clamp, useCanopyFrame } from "@/util";
import { Canopy } from "./Canopy";
import { NUM_LEDS_PER_STRIP, NUM_STRIPS } from "./constants";

type StripProps = {
  leds: LedInterface[][];
  length: number;
  rotation: number;
};

type CanopySvgProps = {
  mini?: boolean;
  width?: number;
  pattern: PatternInstance;
  patternProps: object;
};

type CanopySvgState = {
  canopy: CanopyInterface;
  width: number;
};

// Rendering constants
const LED_RADIUS = 2;
const LED_GAP = 3;

function Strip({ leds, length, rotation }: StripProps) {
  const interval = LED_RADIUS * 2 + LED_GAP;

  // We render as many LEDs from the array as we can, respecting the spacing rules
  const numToRender = Math.floor(length / interval) - 1;

  // The strip is rotated a specified amount, then translated along its radial path as though
  // there was an invisible LED at the center of the canopy
  const transform = `
        rotate(${rotation})
        translate(${interval} 0)
    `;

  return (
    <g transform={transform}>
      {_.range(numToRender).map((i) => {
        const fill = combine(leds[i]);
        return (
          <circle
            fill={fill.toString()}
            fillOpacity={clamp(fill.a, 0.2, 1)}
            key={i}
            r={LED_RADIUS}
            cx={interval * i}
            cy={0}
          />
        );
      })}
    </g>
  );
}

export function CanopySvg(props: CanopySvgProps) {
  const { mini, pattern } = props;

  const width = useMemo(() => (mini ? 200 : props.width), [mini, props.width]);
  const [canopy, setCanopy] = useState(makeCanopy());

  useCanopyFrame(() => {
    // If the component no longer has a pattern (e.g. if it is in the process of unmounting)
    // then do not attempt to update or render
    if (!pattern) return;

    const canopy = makeCanopy();
    pattern.progress();
    pattern.render(canopy);
    setCanopy(canopy);
  }, [pattern]);

  if (typeof width !== "number") {
    throw new Error("width must be a number");
  }

  const rotationAmount = -360 / canopy.strips.length;
  const halfWidth = width / 2;
  const viewBox = `-${halfWidth} -${halfWidth} ${width} ${width}`;

  return (
    <svg viewBox={viewBox} width={width} height={width}>
      {canopy.strips.map((strip, i) => {
        const rotation = rotationAmount * i;
        return (
          <Strip
            key={i}
            leds={strip.leds}
            length={halfWidth}
            rotation={rotation}
          />
        );
      })}
    </svg>
  );

  function makeCanopy() {
    return new Canopy(NUM_STRIPS, NUM_LEDS_PER_STRIP);
  }
}
