
import * as React from 'react';

import Button from '@material-ui/core/Button';
import Popover  from '@material-ui/core/Popover';
import { withTheme } from '@material-ui/core/styles';

import { RGB } from '../../colors';
import PropTypes from "prop-types";


@withTheme()
export default class PropWindow extends React.Component {
    static propTypes = {
        anchorOrigin: PropTypes.shape({
            vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
            horizontal: PropTypes.oneOf(['left', 'center', 'right']),
        }),
        transformOrigin: PropTypes.shape({
            vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
            horizontal: PropTypes.oneOf(['left', 'center', 'right']),
        }),
        buttonColor: PropTypes.shape({
            toString: PropTypes.func
        }),
        buttonText: PropTypes.string.isRequired,
        style: PropTypes.object
    };

    static defaultProps = {
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
        },
        transformOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
        },
        buttonColor: new RGB(122, 122, 122),
        style: null
    };

    state = {
        anchorEl: null
    };

    handleClick = event => this.setState({ anchorEl: event.currentTarget });
    handleClose = () => this.setState({ anchorEl: null });

    renderButton () {
        const { theme, buttonColor, buttonText } = this.props;

        const colorHex = buttonColor.toString();
        const style = {
            color: theme.palette.getContrastText(colorHex),
            backgroundColor: colorHex,
            '&:hover': {
                backgroundColor: colorHex,
            },
        };

        return (
            <Button
              onClick={this.handleClick}
              size="small"
              style={style}
              variant="contained"
            >
                {buttonText}
            </Button>
        );
    }

    render () {
        const { anchorOrigin, transformOrigin, children, style } = this.props;
        const { anchorEl } = this.state;
        return (
            <div className="pattern-prop">
                {this.renderButton()}
                <Popover
                  open={!!anchorEl}
                  anchorEl={anchorEl}
                  onClose={this.handleClose}
                  anchorOrigin={anchorOrigin}
                  transformOrigin={transformOrigin}
                  style={style}
                >
                    {children}
                </Popover>
            </div>
        );
    }
}
