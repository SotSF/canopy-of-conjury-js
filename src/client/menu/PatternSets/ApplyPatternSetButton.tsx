import * as React from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import messenger from '../../messenger';


const ApplyPatternSetButtonStyles = (theme: Theme) => createStyles({
  applyPatternSetButton: {
    marginBottom: theme.spacing()
  }
});

interface ApplyPatternSetButtonProps extends WithStyles<typeof ApplyPatternSetButtonStyles> {
  patternSets: string[]
}

interface ApplyPatternSetButtonState {
  anchorEl: HTMLElement
  patternSetName: string
}

export default withStyles(ApplyPatternSetButtonStyles)(
  class ApplyPatternSetButton extends React.Component<ApplyPatternSetButtonProps, ApplyPatternSetButtonState> {
    state = {
      anchorEl: null,
      patternSetName: ''
    };

    handleClick = event => this.setState({ anchorEl: event.currentTarget });
    handleClose = () => this.setState({ anchorEl: null });

    applyPatternSet = (patternSetName: string) => {
      messenger.applyPatternSet(patternSetName);
    };

    render () {
      const { classes, patternSets } = this.props;
      const { anchorEl } = this.state

      return [
        <Button
          className={classes.applyPatternSetButton}
          color="primary"
          key="button"
          onClick={(e) => this.setState({ anchorEl: e.currentTarget })}
          size="small"
          variant="contained"
        >
          Apply Pattern Set
        </Button>,
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          key="menu"
          onClose={this.handleClose}
          open={Boolean(anchorEl)}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {patternSets.map(patternSetName =>
            <MenuItem
              key={patternSetName}
              onClick={() => this.applyPatternSet(patternSetName)}
              value={patternSetName}
            >
              {patternSetName}
            </MenuItem>
          )}
        </Menu>
      ];
    }
  }
);
