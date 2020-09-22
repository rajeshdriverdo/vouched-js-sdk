import { createMuiTheme } from '@material-ui/core/styles';
import {light} from "@material-ui/core/styles/createPalette";

export const theme = createMuiTheme({
    palette: {
        primary:{
            light:'#6b4cd9',
            main: '#4122af',
            dark:'#2d0e9c'
        }
    },
    typography: {
        fontFamily:'Montserrat',
        fontSize: 14,
        button: {
            fontSize: '1rem',
            backgroundColor:'#2d0e9c',
            margin:5,
        },
        h1: {
            fontFamily: "Roboto Helvetica Arial sans-serif",
            fontWeight: 300,
            fontSize: "6rem",
            lineHeight: 1.167,
            letterSpacing: "-0.01562em"
        },
        h2: {
            fontFamily: "Roboto Helvetica Arial sans-serif",
            fontWeight: 300,
            fontSize: "3.75rem",
            lineHeight: 1.2,
            letterSpacing: "-0.00833em"
        },
    },
});
