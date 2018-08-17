
import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import MuiPopover  from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';

import { RGB } from '../../colors';


const styles = {
    transparent: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'visible',
    }
};

@withStyles(styles, { withTheme: true })
export default class Popover extends React.Component {
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
        buttonProps: PropTypes.object,
        buttonText: PropTypes.string.isRequired,
        className: PropTypes.string,
        onOpen: PropTypes.func,
        paperClasses: PropTypes.string,
        style: PropTypes.object,
        transparent: PropTypes.bool,
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
        buttonProps: {},
        className: null,
        onOpen: () => {},
        paperClasses: null,
        style: null,
        transparent: false,
    };

    state = {
        anchorEl: null
    };

    handleClose = () => this.setState({ anchorEl: null });
    handleClick = (event) => {
        this.props.onOpen();
        this.setState({ anchorEl: event.currentTarget });
    };

    renderButton () {
        const { theme, buttonColor, buttonProps, buttonText } = this.props;

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
              {...buttonProps}
            >
                {buttonText}
            </Button>
        );
    }

    render () {
        const { anchorEl } = this.state;
        const {
            anchorOrigin,
            children,
            className,
            classes,
            paperClasses,
            style,
            transformOrigin,
            transparent,
        } = this.props;

        const PaperProps = {
            classes: {
                root: classNames(paperClasses, {
                    [classes.transparent]: transparent,
                }),
            },
        };

        return (
            <div className={className}>
                {this.renderButton()}
                <MuiPopover
                  open={!!anchorEl}
                  anchorEl={anchorEl}
                  onClose={this.handleClose}
                  anchorOrigin={anchorOrigin}
                  transformOrigin={transformOrigin}
                  style={style}
                  PaperProps={PaperProps}
                >
                    {children}
                </MuiPopover>
            </div>
        );
    }
}
