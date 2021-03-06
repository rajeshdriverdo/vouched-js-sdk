import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {AppProps} from "./Utils";
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './theme';

import {createStore} from 'redux';
import {allReducers} from './reducers'
import {Provider} from 'react-redux';

const store = createStore(allReducers, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

let screens: string[] = [];
screens.push("ID");
screens.push("Face");
screens.push("Result");

let navConfig: AppProps = {screens:screens};

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <ThemeProvider theme={theme}>
              <App navProps={navConfig} />
          </ThemeProvider>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
