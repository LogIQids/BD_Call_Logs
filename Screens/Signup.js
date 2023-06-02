import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import SimCardsManagerModule from 'react-native-sim-cards-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tick = require('../assets/tickIconGreen.png');
const width = Dimensions.get('window').width;
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simcardData: null,
    };
  }
  async componentDidMount() {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS, {
      title: 'Call Log Example',
      message: 'Access your call logs',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      {
        title: 'Call Log Example',
        message: 'Access your call logs',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    !this.props.data?.phoneNumber
      ? await SimCardsManagerModule.getSimCards({
          title: 'App Permission',
          message: 'Custom message',
          buttonNeutral: 'Not now',
          buttonNegative: 'Not OK',
          buttonPositive: 'OK',
        })
          .then(array => {
            console.log('array', array);
            let newarray = array.map(item => {
              let phone = item.phoneNumber;
              let actual_phone = phone.slice(-10);
              console.log('actual_phone', actual_phone);
              phone = '+91' + actual_phone;
              console.log('phone', phone);
              return {
                ...item,
                phoneNumber: phone,
              };
            });
            console.log('newarray', newarray);
            this.setState({
              simcardData: [...newarray],
            });
          })
          .catch(error => {
            ToastAndroid.show('Could not fetch sim Data', ToastAndroid.SHORT);
          })
      : null;
  }
  saveData = async () => {
    const {phoneNumber, subscriptionId} = this.state;
    if (phoneNumber) {
      const jsonValue = JSON.stringify({
        phoneNumber: phoneNumber,
        subscriptionId: subscriptionId,
      });
      this.props.saveData({
        phoneNumber: phoneNumber,
        subscriptionId: subscriptionId,
      });
      await AsyncStorage.setItem('data', jsonValue);
      console.log('data', this.props.data);
      // this.props.navigation.navigate('Login');
    } else {
      ToastAndroid.show('Select atleast one option', ToastAndroid.SHORT);
    }
  };
  render() {
    const {simcardData, phoneNumber} = this.state;
    console.log('simcardData', simcardData);
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Select Phone Number </Text>
        {simcardData?.map(item => (
          <TouchableOpacity
            onPress={() => {
              this.setState({
                phoneNumber: item.phoneNumber,
                subscriptionId: item.subscriptionId,
              });
            }}>
            <View
              style={[
                styles.itemList,
                phoneNumber === item.phoneNumber && styles.greenBorder,
              ]}>
              <Text style={styles.itemText}>{item.phoneNumber}</Text>
              {phoneNumber === item.phoneNumber && (
                <Image source={tick} style={styles.tick} resizeMode="contain" />
              )}
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => this.saveData()}>
          <View style={styles.button}>
            {this.state.loading ? (
              <ActivityIndicator size={'small'} color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Proceed</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    data: state.data,
  };
}

export default connect(mapStateToProps, actions, null)(Signup);
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button: {
    backgroundColor: '#3F51B5',
    marginVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    width: width * 0.6,
    padding: 10,
  },
  buttonText: {color: '#fff', fontSize: 18, textAlign: 'center'},
  text: {
    color: '#000',
    fontSize: 20,
  },
  itemList: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.6,
    justifyContent: 'space-between',
  },
  itemText: {
    color: '#000',
    fontSize: 16,
  },
  tick: {
    width: 20,
    height: 20,
  },
  greenBorder: {
    borderColor: '#1BB55C',
  },
});
