
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import messenger from '../../messenger';
import { Popover } from '../components';


const SaveButtonStyles = (theme: Theme) => createStyles({
  card: {
    backgroundColor: '#626262',
    padding: '1rem',
    display: 'flex',
    alignItems: 'baseline'
  },
  saveButton: {
    marginLeft: theme.spacing()
  }
});

interface SaveButtonProps extends WithStyles<typeof SaveButtonStyles> {
  disabled: boolean
}

interface SaveButtonState {
  anchorEl: HTMLElement
  patternSetName: string
}

export default withStyles(SaveButtonStyles)(
  class SaveButton extends React.Component<SaveButtonProps, SaveButtonState> {
    state = {
      anchorEl: null,
      patternSetName: ''
    };

    handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
      this.setState({ anchorEl: null });
    };

    savePatternSet = () => {
      messenger.savePatternSet(this.state.patternSetName);
    };
    
    updateName = (event) => {
      this.setState({ patternSetName: event.target.value });
    };

    render () {
      const { classes, disabled } = this.props;

      // Can't save the pattern set if no name is entered
      const saveDisabled = this.state.patternSetName === '';

      return [
        <Button
          disabled={disabled}
          key="button"
          onClick={this.handleClick}
          size="small"
          variant="contained"
        >
          Save Pattern Set
        </Button>,
        <Popover
          anchorEl={this.state.anchorEl}
          key="popover"
          onClose={this.handleClose}
        >
          <Card className={classes.card}>
            <TextField
              id="pattern-set-name"
              label="Name"
              onChange={this.updateName}
              value={this.state.patternSetName}
            />

            <Button
              className={classes.saveButton}
              color="primary"
              disabled={saveDisabled}
              onClick={this.savePatternSet}
              size="small"
              variant="contained"
            >
              Save
            </Button>
          </Card>
        </Popover>
      ];
    }
  }
);
