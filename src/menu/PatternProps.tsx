import * as React from "react";
import Card from "@mui/material/Card";

import { PatternPropTypes as Types } from "@/patterns/utils";
import { PropType } from "@/types";
import {
  Checkbox,
  ColorPicker,
  EnumeratedList,
  OscillatorWidget,
  Slider,
} from "./components";

type PatternPropsProps = {
  onChange(props: object): void;
  propTypes: object;
  propValues: Record<string, any>;
};

export function PatternProps({
  onChange,
  propTypes,
  propValues,
}: PatternPropsProps) {
  const components = Object.entries(propTypes).map(([propName, type]) => {
    return (
      <ArbitraryProp
        key={propName}
        name={propName}
        type={type}
        value={propValues[propName]}
        onChange={updateProp(propName)}
      />
    );
  });

  return (
    <Card raised sx={{ backgroundColor: "primary.dark", padding: "1rem" }}>
      {components}
    </Card>
  );

  function updateProp(propName: string) {
    return (value: any) => onChange({ ...propValues, [propName]: value });
  }
}

type PropTypeElement<T extends PropType> = (
  props: ArbitraryPropProps<T>
) => JSX.Element;

type ArbitraryPropProps<T = any> = {
  name: string;
  onChange(value: any): void;
  type: T;
  value: any;
};

function ArbitraryProp(props: ArbitraryPropProps) {
  const { type } = props;

  if (type instanceof Types.Color) {
    return <ColorProp {...props} />;
  } else if (type instanceof Types.Enum) {
    return <EnumerationProp {...props} />;
  } else if (type instanceof Types.Range) {
    return <SliderProp {...props} />;
  } else if (type instanceof Types.Boolean) {
    return <BooleanProp {...props} />;
  } else if (type instanceof Types.Array) {
    return <ArrayProp {...props} />;
  } else if (type instanceof Types.Oscillator) {
    return <OscillatorProp {...props} />;
  }

  // Shouldn't get here...
  return null;
}

const ArrayProp: PropTypeElement<Types.Array> = (p) => {
  const { name, onChange, type, value } = p;
  const subtype = type.types;
  const values = value as any[];
  const existing = values.map((value, i) => {
    const changeExisting = (newValue: any) => {
      const newValues = [...values];
      newValues.splice(i, 1, newValue);
      onChange(newValues);
    };

    return (
      <ArbitraryProp
        key={i}
        name={`${name} ${i}`}
        type={subtype}
        value={value}
        onChange={changeExisting}
      />
    );
  });

  const addNew = (newValue: any) => onChange([...values, newValue]);
  return (
    <div>
      {existing}
      <ArbitraryProp
        name={name}
        type={subtype}
        value={null}
        onChange={addNew}
      />
    </div>
  );
};

const BooleanProp: PropTypeElement<Types.Boolean> = (p) => (
  <Checkbox checked={p.value} label={p.name} onChange={p.onChange} />
);

const ColorProp: PropTypeElement<Types.Color> = (p) => (
  <ColorPicker
    color={p.value}
    onChange={p.onChange}
    oscillation={p.type.oscillation}
    defaults={p.type.defaults}
  />
);

const EnumerationProp: PropTypeElement<Types.Enum> = (p) => (
  <EnumeratedList enumeration={p.type} onChange={p.onChange} value={p.value} />
);

const OscillatorProp: PropTypeElement<Types.Oscillator> = (p) => (
  <OscillatorWidget buttonText={p.name} oscillator={p.value} />
);

const SliderProp: PropTypeElement<Types.Range> = (p) => (
  <Slider
    defaults={p.type.defaults}
    label={p.name}
    min={p.type.min}
    max={p.type.max}
    onChange={p.onChange}
    oscillation={p.type.oscillation}
    step={p.type.step}
    value={p.value}
  />
);
