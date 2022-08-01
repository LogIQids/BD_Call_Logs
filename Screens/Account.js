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
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import Icon4 from 'react-native-vector-icons/Ionicons';

import {connect} from 'react-redux';
import * as actions from '../actions';
import Modal from 'react-native-modal';

var axios = require('axios');

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      items: [
        {label: 'January', value: 'January'},
        {label: 'February', value: 'February'},
        {label: 'March', value: 'March'},
        {label: 'April', value: 'April'},
        {label: 'May', value: 'May'},
        {label: 'June', value: 'June'},
        {label: 'July', value: 'July'},
        {label: 'August', value: 'August'},
        {label: 'September', value: 'September'},
        {label: 'October', value: 'October'},
        {label: 'November', value: 'November'},
        {label: 'December', value: 'December'},
      ],
      itemsSearch: [
        {label: 'SSN', value: 'SSn'},
        {label: 'Email', value: 'Email'},
        {label: 'Phone Number', value: 'Phone'},
        {label: 'Type of transaction', value: 'type'},
        {label: 'Time/Date', value: 'Time'},
      ],
      selectedMonth: null,
      globalLoader: true,
    };
  }
  componentDidMount() {
    this.fetchProfile();
  }
  fetchProfile = () => {
    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .get(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/profile`,

        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        console.log('response', response.data);
        this.setState({
          email: response.data && response.data.email,
          name: response.data && response.data.name,
          phone: response.data && response.data.phone,
          balance: response.data && response.data.balance,
          globalLoader: false,
        });
      })
      .catch(e => console.log('op', e));
  };
  handleOnchange = (type, data) => {
    this.setState({[type]: data});
  };
  updateDetails = () => {
    this.setState({loader: true});
    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/profile-update`,
        {
          email: this.state.email,
          phone: this.state.phone,
          name: this.state.name,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        ToastAndroid.show('Data Updated', ToastAndroid.SHORT);
        this.setState({loader: false});

        this.fetchProfile();
      })
      .catch(e => {
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({loader: false});
      });
  };
  renderModal = () => {
    return (
      <Modal
        animationInTiming={800}
        animationOutTiming={600}
        backdropTransitionInTiming={700}
        backdropTransitionOutTiming={400}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        isVisible={this.state.logoutModal}
        style={{
          flex: 1,
          width: '90%',
          marginTop: 50,
          position: 'absolute',
          top: '33%',
          flexDirection: 'column',
          zIndex: 1,
        }}
        onBackButtonPress={() => {
          this.setState({logoutModal: false});
        }}
        statusBarTranslucent={true}
        onBackdropPress={() => {
          this.setState({logoutModal: false});
        }}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 16,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}>
          <Text
            style={{
              color: '#2F2C3D',
              fontSize: 20,
              fontWeight: '700',
              lineHeight: 35,
            }}>
            Logout
          </Text>
          <Text style={[{marginBottom: 15}]}>
            {'Are you sure you want\n'}
            {'to logout ?'}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.updateDetails();
                }}>
                {this.state.loader ? (
                  <ActivityIndicator color={'silver'} size="small" />
                ) : (
                  <Text
                    style={{color: '#fff', textAlign: 'center', fontSize: 16}}>
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.updateDetails();
                }}>
                {this.state.loader ? (
                  <ActivityIndicator color={'silver'} size="small" />
                ) : (
                  <Text
                    style={{color: '#fff', textAlign: 'center', fontSize: 16}}>
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  render() {
    return this.state.globalLoader ? (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 15,
          backgroundColor: '#343244',
        }}>
         <ActivityIndicator color={'silver'} size="large" />
        </View>
    ) : (
      <View style={styles.container}>
        {this.renderModal()}
        <Icon2
          name="logout"
          color={'#fff'}
          size={25}
          style={{position: 'absolute', top: 20, right: 20}}
          onPress={() => {
            this.setState({logoutModal: true});
          }}
        />
        <View
          style={{
            width: '90%',
            backgroundColor: '#3C3F45',
            borderRadius: 8,
            paddingHorizontal: 20,
            paddingVertical: 25,
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              alignSelf: 'center',
              width: 70,
              height: 70,
              borderWidth: 3,
              borderRadius: 70,
              borderColor: '#FFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <Icon name="user" size={40} color="#fff" style={{}} />
          </View>
          <View style={{flex: 0.9}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 26,
                  marginRight: 8,
                  fontWeight: '900',
                }}>
                {this.state.balance}
              </Text>
              <Text style={{color: '#C1C4CC', fontSize: 10}}>INR</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon4
                name="wallet"
                size={12}
                color="#C1C4CC"
                style={{marginRight: 5}}
              />
              <Text style={{color: '#C1C4CC', fontSize: 12}}>
                Account Balance
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            borderBottomWidth: 1,
            borderBottomColor: '#fff',
          }}>
          <Icon2
            name="account"
            size={17}
            color="#fff"
            style={{marginRight: 10}}
          />
          <TextInput
            placeholder="Enter Name"
            style={[
              {
                flex: 0.95,
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
              },
            ]}
            onChangeText={text => this.handleOnchange('name', text)}
            value={this.state.name}
            placeholderTextColor="#fff"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            borderBottomWidth: 1,
            borderBottomColor: '#fff',
          }}>
          <Icon3
            name="phone"
            size={17}
            color="#fff"
            style={{marginRight: 10}}
          />

          <TextInput
            placeholder="Enter Phone"
            style={[
              {
                flex: 0.95,
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
              },
            ]}
            onChangeText={text => this.handleOnchange('phone', text)}
            value={this.state.phone}
            placeholderTextColor="#fff"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            borderBottomWidth: 1,
            borderBottomColor: '#fff',
          }}>
          <Icon2
            name="email"
            size={17}
            color="#fff"
            style={{marginRight: 10}}
          />

          <TextInput
            placeholder="Enter Email"
            style={[
              {
                flex: 0.95,
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
              },
            ]}
            onChangeText={text => this.handleOnchange('email', text)}
            value={this.state.email}
            placeholderTextColor="#fff"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              this.updateDetails();
            }}>
            {this.state.loader ? (
              <ActivityIndicator color={'silver'} size="small" />
            ) : (
              <Text style={{color: '#fff', textAlign: 'center', fontSize: 16}}>
                Update
              </Text>
            )}
          </TouchableOpacity>
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

export default connect(mapStateToProps, actions, null)(Account);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#343244',
  },
  textInputStyle: {
    borderWidth: 1,
    width: '40%',
  },
  buttonContainer: {
    backgroundColor: '#2F2C3D',
    color: '#fff',
    padding: 10,
    margin: 8,
    borderRadius: 5,
    width: '90%',
    marginTop: 50,
    borderWidth: 0.5,
    borderColor: '#FFF',
  },
});
