import _ from "lodash";
import * as PubSub from "pubsub-js";
import { useEffect, useRef, useState } from "react";

import Drawer from "@mui/material/Drawer";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

import events from "@/events";
import * as messenger from "@/messenger";
import * as patterns from "@/patterns";
import { updatePatterns } from "@/state";
import { CanopyInterface, IPatternActive, PatternInterface } from "@/types";
import { useCanopyFrame } from "@/util";

import { ActivePatterns } from "./ActivePatterns";
import { Patterns } from "./Patterns";

type MenuProps = {
  canopy: CanopyInterface;
  width: number;
};

const presets = [
  {
    pattern: patterns.TestLEDs as unknown as PatternInterface,
    name: "Test LEDs",
  },
];

export function Menu({ canopy, width }: MenuProps) {
  // The active patterns are stored both in state and in a ref, and kept in sync in the
  // `syncPatterns` function. Below. The reason we need patterns in state is because we need to
  // re-render the menu when a pattern is added or removed (state is not updated when the pattern
  // "progresses"--progressing a pattern intentionally mutates state). The reason we need patterns
  // in a ref is so that the `updatePatterns` function can access the patterns without capturing
  // the state in a closure. If we captured the state in a closure, the `updatePatterns` function
  // would contain a stale reference to the initial patterns, captured on mount.
  const [patterns, setPatterns] = useState<IPatternActive[]>([]);
  const patternsRef = useRef(patterns);

  useEffect(() => {
    const subscription = PubSub.subscribe(
      events.updatePatterns,
      (_, patterns: IPatternActive[]) => syncPatterns(patterns, false)
    );

    return () => {
      PubSub.unsubscribe(subscription);
    };
  });

  // Update the pattern 20 times per second
  useCanopyFrame(() => {
    canopy.clear();

    // Important: access the pattern ref, not the state
    patternsRef.current.forEach((pattern) => {
      pattern.instance.progress();
      pattern.instance.render(canopy);
    });
  }, [canopy, patternsRef]);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          backgroundColor: "primary.800",
          width,
          border: "none",
        },
      }}
      // PaperProps={{ sx: { backgroundColor: "#424242", width: `${width}px` } }}
    >
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Presets</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <List dense disablePadding sx={{ width: "100%" }}>
            <ListItemButton>
              <ListItemText primary="Clear" onClick={clear} />
            </ListItemButton>

            {presets.map(({ pattern, name }) => (
              <ListItemButton key={name}>
                <ListItemText
                  primary={name}
                  onClick={() => addPattern(pattern, name)}
                />
              </ListItemButton>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Patterns addPattern={addPattern} />

      <ActivePatterns patterns={patterns} removePattern={removePattern} />
    </Drawer>
  );

  function clear() {
    canopy.clear();
    syncPatterns([]);
    messenger.state.clearPatterns();
  }

  function addPattern(pattern: PatternInterface, params: any) {
    // Create a unique ID for the pattern instance
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const id = _.range(20)
      .map(() => _.sample(characters))
      .join("");

    const order = patterns.length;
    const instance = new pattern({ ...params });
    const newPatterns: IPatternActive[] = [
      {
        id,
        instance,
        name: pattern.displayName,
        order,
      },
      ...patterns,
    ];

    messenger.state.addPattern(id, instance, order);
    syncPatterns(newPatterns);
  }

  function removePattern(patternId: IPatternActive["id"]) {
    const patternToRemove = _.find(patterns, { id: patternId });
    const newPatterns = _.without(
      patterns,
      patternToRemove
    ) as IPatternActive[];

    messenger.state.removePattern(patternId);
    syncPatterns(newPatterns);
  }

  function syncPatterns(patterns: IPatternActive[], serverSync = true) {
    setPatterns(patterns);
    patternsRef.current = patterns;
    if (serverSync) updatePatterns(patterns);
  }
}

export default Menu;
