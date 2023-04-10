import { MouseEvent, useEffect, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Card from "@mui/material/Card";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CanopySvg } from "@/canopy";
import { allPatterns } from "@/patterns";
import { PatternProps } from "./PatternProps";
import { PatternInterface } from "@/types";

type PatternOptionProps = {
  addPattern: (pattern: any, props: any) => void;
  pattern: PatternInterface;
};

type PatternOptionState = Partial<{
  anchorEl: HTMLButtonElement;
  instance: any;
  patternProps: any;
}>;

function PatternButton({ addPattern, pattern }: PatternOptionProps) {
  const [state, setState] = useState<PatternOptionState>({});
  const { anchorEl, instance, patternProps } = state;

  return (
    <Grid item sm={6}>
      <ButtonBase onClick={handleClick} sx={{ width: "100%" }}>
        {/* <p>{pattern.displayName}</p> */}
        <Typography variant="body2" sx={{ margin: "1em 0" }}>
          {pattern.displayName}
        </Typography>
      </ButtonBase>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        elevation={0}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: { backgroundColor: "transparent", overflow: "visible" },
        }}
      >
        {instance && (
          <Box
            component="div"
            sx={{ display: "flex", alignItems: "flex-start" }}
          >
            <PatternProps
              propTypes={pattern.propTypes}
              propValues={patternProps}
              onChange={updateProps}
            />

            <Card
              sx={{ backgroundColor: "primary.dark", marginLeft: 1 }}
              raised
            >
              <CanopySvg mini pattern={instance} patternProps={patternProps} />
            </Card>

            <Fab
              color="secondary"
              onClick={handleSubmit}
              size="medium"
              sx={{ position: "absolute", right: "-20px", top: "10px" }}
            >
              <AddIcon />
            </Fab>
          </Box>
        )}
      </Popover>
    </Grid>
  );

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const patternProps = pattern.defaultProps();
    setState({
      anchorEl: event.currentTarget,
      instance: new pattern(patternProps),
      patternProps,
    });
  }

  function handleClose() {
    setState({});
  }

  function updateProps(patternProps: any) {
    setState({ ...state, patternProps });
    instance.updateProps(patternProps);
  }

  function handleSubmit() {
    addPattern(pattern, patternProps);
    handleClose();
  }
}

type PatternsProps = {
  addPattern: (pattern: any, props: any) => void;
};

export function Patterns({ addPattern }: PatternsProps) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body1">Patterns</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Grid container spacing={0}>
          {allPatterns.map((Pattern) => (
            <PatternButton
              key={Pattern.displayName}
              pattern={Pattern}
              addPattern={addPattern}
            />
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
