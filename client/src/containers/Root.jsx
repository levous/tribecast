import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {browserHistory, Router} from 'react-router';
import {Provider} from 'react-redux';
import {member_action_types} from '../actions/member-actions';
import configureStore from '../store/configureStore';
import routes from '../routes';

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
