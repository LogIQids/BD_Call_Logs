import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import * as actions from '../actions';

// import {LOGIN} from '../Routes';
var axios = require('axios');
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  componentDidMount() {
    console.log('mounted');
  }
  handleOnchange = (type, data) => {
    this.setState({[type]: data});
  };
  handleLogin = async () => {
    this.setState({submitLogin: true});
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/login`,
        {
          email: this.state.email,
          password: this.state.password,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        console.log('resp.data', response);
        if (response && response.data) {
          this.props.handlelogin(response.data);
        }

        this.setState({submitLogin: false});
      })
      .catch(e => {
        console.log('e', e);
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({submitLogin: false});
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            alignSelf: 'center',
            width: 100,
            height: 100,
            borderWidth: 3,
            borderRadius: 100,
            borderColor: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Icon2 name="bank" size={70} color="#fff" style={{}} />
        </View>
        <Text
          style={{
            color: '#fff',
            fontSize: 26,
            textAlign: 'center',
            marginVertical: 15,
          }}>
          Namaste
        </Text>
        <View
          style={{
            marginHorizontal: 10,
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#fff',
              marginBottom: 20,
            }}>
            <Icon
              name="email-outline"
              size={17}
              color="#fff"
              style={{marginRight: 10}}
            />
            <TextInput
              placeholder="Enter Email"
              style={{
                flex: 0.95,
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
              }}
              onChangeText={text => this.handleOnchange('email', text)}
              placeholderTextColor="#fff"
              value={this.state.email}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: '#fff',
              marginBottom: 20,
            }}>
            <Icon2
              name="lock"
              size={17}
              color="#fff"
              style={{marginRight: 10}}
            />
            <TextInput
              placeholder="Enter Password"
              style={{
                flex: 0.95,
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
              }}
              placeholderTextColor="#fff"
              onChangeText={text => this.handleOnchange('password', text)}
              value={this.state.password}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                this.handleLogin();
              }}>
              {this.state.submitLogin ? (
                <ActivityIndicator color={'silver'} size="small" />
              ) : (
                <Text style={{color: '#fff', textAlign: 'center'}}>LOGIN</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

export default connect(mapStateToProps, actions, null)(Login);
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: '#343244',
  },
  textInputStyle: {
    borderWidth: 1,
    width: '40%',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#2F2C3D',
    color: '#fff',
    padding: 10,
    margin: 8,
    borderRadius: 5,
    paddingVertical: 15,
    borderWidth: 0.5,
    borderColor: '#FFF',
  },
});
