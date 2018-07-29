
import { createMuiTheme } from '@material-ui/core/styles';
import shadows from '@material-ui/core/styles/shadows';


export default createMuiTheme({
    palette: {
        type: 'dark'
    },

    /** Material UI overrides */
    overrides: {
        MuiButton: {
            root: {
                boxShadow: shadows[3]
            },

            raised: {
                boxShadow: shadows[11]
            }
        },

        MuiExpansionPanelSummary: {
            content: {
                alignItems: 'center'
            }
        },

        MuiSelect: {
            selectMenu: {
                minHeight: '16px'
            }
        },

        MuiSlider: {
            root: {
                boxSizing: 'border-box'
            }
        }
    }
});
