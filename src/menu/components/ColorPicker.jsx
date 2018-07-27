
import * as React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';

import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { withTheme } from '@material-ui/core/styles';

import { rgbToHexString, RGB} from '../../colors';


@withTheme()
export default class ColorPicker extends React.Component {
    static propTypes = {
        anchorOrigin: PropTypes.shape({
            vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
            horizontal: PropTypes.oneOf(['left', 'center', 'right']),
        }),
        onChange: PropTypes.func,
        transformOrigin: PropTypes.shape({
            vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
            horizontal: PropTypes.oneOf(['left', 'center', 'right']),
        })
    };

    static defaultProps = {
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
        onChange: () => {},
        transformOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
        }
    };

    constructor (props) {
        super(props);
        this.state = {
            anchorEl: null,
            color: props.color || {
                r: Math.floor(Math.random() * 256),
                g: Math.floor(Math.random() * 256),
                b: Math.floor(Math.random() * 256)
            }
        };
    }

    handleClick = event => this.setState({ anchorEl: event.currentTarget });
    handleClose = () => this.setState({ anchorEl: null });

    updateColor = ({ rgb }) => {
        this.setState({ color: rgb });
        this.props.onChange(new RGB(rgb.r, rgb.g, rgb.b));
    };

    renderButton () {
        const { theme } = this.props;
        const { color } = this.state;

        const colorHex = rgbToHexString(color);
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
                Color
            </Button>
        );
    }

    render () {
        const { anchorOrigin, transformOrigin } = this.props;
        const { anchorEl } = this.state;
        return (
            <div>
                {this.renderButton()}
                <Popover
                  open={!!anchorEl}
                  anchorEl={anchorEl}
                  onClose={this.handleClose}
                  anchorOrigin={anchorOrigin}
                  transformOrigin={transformOrigin}
                >
                    <ChromePicker
                      color={this.state.color}
                      disableAlpha
                      onChangeComplete={this.updateColor}
                    />
                </Popover>
            </div>
        );
    }
}
