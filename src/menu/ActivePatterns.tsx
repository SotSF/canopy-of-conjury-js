import { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { IPatternActive } from "@/types";
import * as messenger from "@/messenger";
import { PatternProps } from "./PatternProps";

type RemovePatternProp = { removePattern(id: IPatternActive["id"]): void };
type PatternPropTypes = RemovePatternProp & { pattern: IPatternActive };

function Pattern({ pattern, removePattern }: PatternPropTypes) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement>();
  return (
    <ListItemButton>
      <ListItemText
        onClick={(e) => setAnchorEl(e.currentTarget)}
        primary={pattern.name}
      />
      <ListItemSecondaryAction>
        <DeleteIcon onClick={() => removePattern(pattern.id)} />
      </ListItemSecondaryAction>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(undefined)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <PatternProps
          propTypes={pattern.instance.constructor.propTypes}
          propValues={pattern.instance.props}
          onChange={updateProps}
        />
      </Popover>
    </ListItemButton>
  );

  function updateProps(props: any) {
    pattern.instance.updateProps(props);

    // TODO: debounce
    messenger.state.updateProps(pattern.id, props);
  }
}

type ActivePatternsProps = RemovePatternProp & { patterns: IPatternActive[] };

export function ActivePatterns({
  patterns,
  removePattern,
}: ActivePatternsProps) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box component="div" sx={{ flexGrow: 1 }}>
          <Typography>Active Patterns</Typography>
        </Box>
        <Box component="div" sx={{ flexShrink: 0 }}>
          <Typography sx={{ color: "text.secondary" }}>
            {patterns.length}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <List dense disablePadding>
          {patterns.map((pattern) => (
            <Pattern
              key={pattern.id}
              pattern={pattern}
              removePattern={removePattern}
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
