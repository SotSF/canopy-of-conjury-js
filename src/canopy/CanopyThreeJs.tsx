import * as THREE from "three";
import _ from "lodash";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Points } from "@react-three/drei";

import { NUM_STRIPS, NUM_LEDS_PER_STRIP } from "@/canopy";
import { RGB, combine } from "@/colors";
import { CanopyInterface } from "@/types";
import { useCanopyFrame } from "@/util";
import { Catenary } from "./catenary";

// Constants. Length units are in feet unless otherwise specified
const BASE_RADIUS = 8;
const APEX_RADIUS = 0.5;

type CanopyThreeProps = {
  canopy: CanopyInterface;
};

type StripProps = {
  catenary: Catenary;
  offset: number;
  colors: Float32Array;
};

export function CanopyThree({ canopy }: CanopyThreeProps) {
  // Set of parameters that affect the 3-dimensional shape of the canopy
  const [canopyData, setCanopyData] = useState({
    apexHeight: 0,
    apexRadius: APEX_RADIUS,
    baseRadius: BASE_RADIUS,
    stripLength: canopy.stripLength,
  });

  // Move the apex up and down with the keyboard
  useEffect(() => {
    window.addEventListener("keydown", adjustHeight);
    return () => window.removeEventListener("keydown", adjustHeight);
  });

  const radialInterval = (Math.PI * 2) / NUM_STRIPS;
  const catenary = useMemo(() => new Catenary(canopyData), [canopyData]);
  const blackLed = useMemo(() => new RGB(0, 0, 0), []);

  // Update the colors of the strips
  const colors = useRef(initializeColorArrays());
  useCanopyFrame(() => {
    canopy.strips.forEach((strip, i) => {
      strip.leds.forEach((ledColors, j) => {
        const rgb = combine(ledColors);
        const color = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
        colors.current[i].set(color, j * 3);
      });
    });
  }, [blackLed, canopy.strips, colors]);

  return (
    <group>
      {/* The strips */}
      {canopy.strips.map((_, i) => {
        const offset = i * radialInterval;
        return (
          <Strip
            key={i}
            offset={offset}
            catenary={catenary}
            colors={colors.current[i]}
          />
        );
      })}

      {/* The base */}
      <mesh>
        <torusGeometry args={[BASE_RADIUS, 0.25, 4, 75]} />
        <meshPhongMaterial
          color={0x333333}
          emissive={0x333333}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* The apex */}
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[APEX_RADIUS, APEX_RADIUS, 0.25, 30, 1]} />
        <meshPhongMaterial
          color={0x222222}
          emissive={0x222222}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );

  function adjustHeight(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      setCanopyData((data) => ({ ...data, apexHeight: data.apexHeight + 0.5 }));
    } else if (e.key === "ArrowDown") {
      setCanopyData((data) => ({ ...data, apexHeight: data.apexHeight - 0.5 }));
    }
  }

  function initializeColorArrays() {
    return canopy.strips.map(
      () => new Float32Array(NUM_LEDS_PER_STRIP * NUM_STRIPS * 3)
    );
  }
}

function Strip({ catenary, offset, colors }: StripProps) {
  const lineGeometry = useRef<THREE.BufferGeometry>(null);
  const { coordinates } = catenary;

  // Memoize the positions so we only recompute them when the catenary changes
  const positions = useMemo(() => {
    // Use the Catmull-Rom spline to interpolate the points along the catenary
    // TODO: Is this necessary? Can we just use the catenary coordinates directly?
    // const points = new THREE.CatmullRomCurve3(
    //   catenary.coordinates.map(([x, z]) => new THREE.Vector3(x, 0, -z))
    // ).getPoints(NUM_LEDS_PER_STRIP);

    const pos = new Float32Array(NUM_LEDS_PER_STRIP * 3);
    coordinates.forEach(([x, z], i) => pos.set([x, 0, -z], i * 3));
    return pos;
  }, [coordinates]);

  useLayoutEffect(() => {
    lineGeometry.current?.setFromPoints(
      coordinates.map(([x, z]) => new THREE.Vector3(x, 0, -z))
    );
  }, [coordinates]);

  return (
    <group rotation-z={offset}>
      {/* The string */}
      <line>
        <bufferGeometry ref={lineGeometry} />
        <lineBasicMaterial linewidth={50} color={0xcccccc} />
      </line>

      {/* The LEDs */}
      <Points positions={positions} colors={colors}>
        <pointsMaterial size={0.1} vertexColors={true} />
      </Points>
    </group>
  );
}
