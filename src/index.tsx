import React from 'react';
import ReactDOM from 'react-dom';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import './index.css';
import App from './App';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(50,100,150)',
            light: 'rgb(200,100,0)',
        },
        type: 'dark',
    }
})

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
