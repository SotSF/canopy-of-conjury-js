

import * as React from 'react';
import MuiPopover from '@material-ui/core/Popover';
import { withStyles, createStyles, Theme, WithStyles } from '@material-ui/core/styles';


const MenuPopoverStyles = (theme: Theme) => createStyles({
  root: {
    marginLeft: theme.spacing()
  }
});

export interface PopoverProps extends WithStyles<typeof MenuPopoverStyles> {
  anchorEl: HTMLElement
  onClose: () => void
}

export default withStyles(MenuPopoverStyles)(
  ((props) => (
    <MuiPopover
      open={!!props.anchorEl}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        classes: props.classes
      }}
    >
      {props.children}
    </MuiPopover>
  )) as React.FC<PopoverProps>
);