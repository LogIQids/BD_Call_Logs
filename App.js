/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Home from './Screens/Home';
import Statement from './Screens/Statement';
import Account from './Screens/Account';
import Login from './Screens/Login';
import configureStore from './config/configureStore';
import {Provider} from 'react-redux';
import StackNavigator from './navigation/index';

global.ip = '192.168.1.217';
const store = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'main',
      id: null,
    };
  }
  setScreen = data => {
    this.setState({screen: data});
  };
  handleLoginState = data => {
    console.log('data', data);
    this.setState({id: data.userId});
  };
  logout = () => {
    this.setState({id: null});
  };
  render() {
    // const isDarkMode = useColorScheme() === 'dark';
    console.log('this.state.id', this.state.id);
    // const backgroundStyle = {
    //   backgroundColor: true ? Colors.darker : Colors.lighter,
    // };

    return (
      <Provider store={store}>
          <StackNavigator />
          {/* {!this.state.id ? (
            <Login handleLOgin={data => this.handleLoginState(data)} />
          ) : (
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <View style={{flexDirection: 'row'}}>
                <View
                  style={[
                    styles.buttonContainer,
                    {
                      borderColor:
                        this.state.screen == 'main' ? '#419faf' : null,
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setScreen('main');
                    }}>
                    <Text style={{color: '#fff', textAlign: 'center'}}>
                      Main Menu
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonContainer,
                    {
                      borderColor:
                        this.state.screen == 'Account' ? '#419faf' : null,
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setScreen('Account');
                    }}>
                    <Text style={{color: '#fff', textAlign: 'center'}}>
                      Account
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.buttonContainer,
                    {
                      borderColor:
                        this.state.screen == 'Statement' ? '#419faf' : null,
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setScreen('Statement');
                    }}>
                    <Text style={{color: '#fff', textAlign: 'center'}}>
                      Statement
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.screen == 'main' ? (
                <Home id={this.state.id} handleLogout={() => this.logout()} />
              ) : this.state.screen == 'Statement' ? (
                <Statement id={this.state.id} />
              ) : (
                <Account id={this.state.id} />
              )}
            </ScrollView>
          )} */}
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    width: '33.33%',
    backgroundColor: '#000',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1,
  },
});
