
import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { EnumType } from '../../types';
import PropWindow from './PropWindow';


interface EnumeratedListProps {
    enumeration: EnumType
    onChange (n: number) : void
    value: number
}

interface EnumeratedListState {
    anchorEl: any,
    selection: string
}

export default class EnumeratedList extends React.Component<EnumeratedListProps, EnumeratedListState> {
    constructor (props) {
        super(props);
        this.state = {
            anchorEl: null,
            selection: props.enumeration.value(props.value)
        };
    }

    updateSelection = (selection) => {
        this.setState({ selection }, () => {
            this.props.onChange(this.props.enumeration.index(selection));
        });
    };

    render () {
        const { enumeration } = this.props;
        const { selection } = this.state;
        return (
            <PropWindow buttonText={selection}>
                <List dense disablePadding>
                    {enumeration.values().map((value) =>
                        <ListItem button key={value}>
                            <ListItemText
                              primary={value}
                              onClick={() => this.updateSelection(value)}
                            />
                        </ListItem>
                    )}
                </List>
            </PropWindow>
        );
    }
}
