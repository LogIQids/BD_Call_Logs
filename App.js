import React from 'react';
import configureStore from './config/configureStore';
import {Provider} from 'react-redux';
import StackNavigator from './navigation/index';

const store = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    );
  }
}
