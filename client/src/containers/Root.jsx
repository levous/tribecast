import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { browserHistory, Router } from 'react-router';
import {Provider} from 'react-redux';
import configureStore from '../store/configureStore';
import routes from '../routes.js';

const store = configureStore();

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </Provider>
  );
  }
}
