import { MouseEvent, PropsWithChildren, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiPopover, {
  PopoverProps as MuiPopoverProps,
} from "@mui/material/Popover";
import { useTheme } from "@mui/material/styles";

import { Color, RGB } from "@/colors";

type VerticalPosition = "top" | "center" | "bottom";
type HorizontalPosition = "left" | "center" | "right";
type Anchor = { vertical: VerticalPosition; horizontal: HorizontalPosition };

type PopoverProps = {
  anchorOrigin?: Anchor;
  transformOrigin?: Anchor;
  buttonColor?: Color;
  buttonProps?: object;
  buttonText: string;
  onOpen?: () => void;
  PopoverProps?: Partial<MuiPopoverProps>;
  transparent?: boolean;
};

type PopoverButtonProps = PopoverProps & {
  setAnchor: (anchor: HTMLElement) => void;
};

export function Popover(props: PropsWithChildren<PopoverProps>) {
  const [anchor, setAnchor] = useState<HTMLElement>();
  const {
    anchorOrigin = { vertical: "top", horizontal: "center" },
    children,
    transformOrigin = { vertical: "bottom", horizontal: "center" },
    transparent = false,
  } = props;

  // Merge transparency into PaperProps (which may be provided via PopoverProps)
  const { PaperProps = {}, ...PopoverProps } = props.PopoverProps || {};
  const PaperPropsWithTransparency = {
    sx: transparent
      ? {
          backgroundColor: "transparent",
          boxShadow: "none",
          overflow: "visible",
          ...PaperProps.sx,
        }
      : PaperProps.sx,
  };

  // Add left margin to popover
  const sx = { ...PopoverProps?.sx, marginLeft: 1 };
  const PopoverPropsWithMargin = { ...PopoverProps, sx };

  return (
    <Box component="div" sx={{ "& + &": { marginTop: 1 } }}>
      <PopoverButton {...props} setAnchor={setAnchor} />
      <MuiPopover
        anchorEl={anchor}
        anchorOrigin={anchorOrigin}
        elevation={0}
        onClose={() => setAnchor(undefined)}
        open={!!anchor}
        PaperProps={PaperPropsWithTransparency}
        transformOrigin={transformOrigin}
        {...PopoverPropsWithMargin}
      >
        {children}
      </MuiPopover>
    </Box>
  );
}

function PopoverButton(props: PopoverButtonProps) {
  const {
    buttonColor = new RGB(122, 122, 122),
    buttonProps,
    buttonText,
    onOpen = () => {},
    setAnchor,
  } = props;

  const theme = useTheme();
  const buttonStyles = useMemo(() => {
    const colorHex = buttonColor.toString();
    return {
      color: theme.palette.getContrastText(colorHex),
      backgroundColor: colorHex,
      "&:hover": { backgroundColor: colorHex },
    };
  }, [buttonColor, theme]);

  return (
    <Button
      component="label"
      onClick={(e) => {
        onOpen();
        setAnchor(e.currentTarget);
      }}
      size="small"
      sx={buttonStyles}
      variant="contained"
      {...buttonProps}
    >
      {buttonText}
    </Button>
  );
}
