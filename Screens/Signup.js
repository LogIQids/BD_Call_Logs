import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {MyTextInputField} from '../components/MyTextField';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import UtilityFunctions from '../Utils/utilityfunctions';

const logo = require('../assets/logo.png');
const user = require('../assets/user.png');

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.utils = new UtilityFunctions();
    this.state = {
      email: '',
      password: '',
      username: '',
      image: '',
    };
  }
  componentDidMount() {}
  onChangeMyText = (type, data) => {
    this.setState({[type]: data});
  };
  handleSignup = async () => {
    if (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.username.length > 0
    ) {
      this.setState({submitLogin: true, errorText: null});

      auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(response => {
          this.setState({submitLogin: false});
          if (response?.user) {
            firestore()
              .collection('Users')
              .doc(response?.user?.uid)
              .set({
                username: this.state.username,
                email: this.state.email,
                profileImg: this.state.image,
              })
              .then(() => {
                console.log('User added!');
                this.props.handlelogin({
                  uid: response?.user?.uid,
                  username: this.state.username,
                  email: this.state.email,
                  profileImg: this.state.image,
                });
              });
          }
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            this.setState({errorText: 'Email already in use'});
          }
          if (error.code === 'auth/invalid-email') {
            console.log('The email address is invalid!');
            this.setState({errorText: 'Email address is invalid!'});
          }
          this.setState({submitLogin: false});
        });
    } else {
      ToastAndroid.show(
        'Please enter email,username and password',
        ToastAndroid.SHORT,
      );
    }
  };
  pickImage = async () => {
    const url = await this.utils.uploadImage();
    this.setState({image: `${url}.png`});
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <TouchableOpacity onPress={() => this.pickImage()}>
          {this.state.image.length > 0 ? (
            <Image
              source={{uri: this.state.image}}
              style={styles.profileImg}
              resizeMode={'cover'}
            />
          ) : (
            <Image
              source={user}
              style={styles.profileImg}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        <View
          style={{
            marginHorizontal: 10,
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <MyTextInputField
            attrName="username"
            title="Enter username"
            value={this.state.username}
            onChangeMyText={this.onChangeMyText}
          />
          <MyTextInputField
            attrName="email"
            title="Enter email address"
            value={this.state.email}
            onChangeMyText={this.onChangeMyText}
          />
          <MyTextInputField
            attrName="password"
            title="Password"
            value={this.state.password}
            onChangeMyText={this.onChangeMyText}
            otherTextInputProps={{
              secureTextEntry: true,
            }}
          />
          {this.state.errorText ? (
            <Text style={styles.errorText}>{this.state.errorText}</Text>
          ) : null}
          <TouchableOpacity
            style={{width: '100%'}}
            onPress={() => {
              this.handleSignup();
            }}>
            <View style={styles.buttonContainer}>
              {this.state.submitLogin ? (
                <ActivityIndicator color={'silver'} size="small" />
              ) : (
                <Text style={styles.buttonText}>Sign up</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={[styles.row, styles.signupTextContainer]}>
            <Text style={styles.accountText}>Have an account ? </Text>
            <Text
              style={styles.signupText}
              onPress={() => this.props.navigation.navigate('Login')}>
              Log In
            </Text>
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

export default connect(mapStateToProps, actions, null)(Signup);
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  accountText: {
    color: '#8f8f8f',
    fontSize: 14,
  },
  logo: {
    height: 70,
    resizeMode: 'contain',
  },
  fbImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
  },
  signupTextContainer: {
    marginTop: 25,
  },

  textInputStyle: {
    borderWidth: 1,
    width: '40%',
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#0095f6',
    color: '#fff',
    margin: 8,
    borderRadius: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    width: '90%',
    textAlign: 'right',
  },
  signupText: {
    color: '#1098f6',
    fontSize: 15,
    fontWeight: '700',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
});
