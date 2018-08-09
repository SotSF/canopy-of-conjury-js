
import * as React from 'react';
import CheckboxComponent from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


interface CheckboxProps {
    checked: boolean,
    label: string,
    onChange (checked: boolean) : void
}

export default class Checkbox extends React.Component<CheckboxProps> {
    toggleSelection = () => this.props.onChange(!this.props.checked);

    render () {
        const { checked, label } = this.props;
        return (
            <div>
                <FormControlLabel label={label} control={
                    <CheckboxComponent
                      checked={checked}
                      color="primary"
                      onChange={this.toggleSelection}
                    />
                } />
            </div>
        );
    }
}
