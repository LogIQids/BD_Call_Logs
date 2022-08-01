import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Fontisto';
import Icon3 from 'react-native-vector-icons/AntDesign';

// import LQDropdown from '../components/LQDropdown';
import {connect} from 'react-redux';
import * as actions from '../actions';
var axios = require('axios');

class Statement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      text: '',
      open: false,
      value: null,
      from_date: '',
      to_date: '',
      amountReceived: null,
      amountSent: null,
      totalAvgObjPerMonth: null,
      maxAmountObjPerMonth: null,
      bestUsers: null,
      items: [
        {label: 'January', value: '1'},
        {label: 'February', value: '2'},
        {label: 'March', value: '3'},
        {label: 'April', value: '4'},
        {label: 'May', value: '5'},
        {label: 'June', value: '6'},
        {label: 'July', value: '7'},
        {label: 'August', value: '8'},
        {label: 'September', value: '9'},
        {label: 'October', value: '10'},
        {label: 'November', value: '11'},
        {label: 'December', value: '12'},
      ],
      selectedMonth: null,
    };
  }
  componentDidMount() {
    axios
      .get(`https://harshal-trasactions-project.herokuapp.com/get-best-users`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log('response statement', response.data);
        this.setState({
          bestUsers: response.data,
        });
      })
      .catch(e => console.log('op', e));
  }
  handleClassSelection = value => {
    console.log('value', value);
    this.setState({
      selectedMonth: value,
    });
  };
  onChange = (event, date) => {
    if (date === undefined) {
      this.setState({showFromPicker: false, showToPicker: false});
    }
    if (this.state.showFromPicker) {
      this.setState({
        from_date:
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate(),
        dobProvided: date,
        showFromPicker: false,
      });
    }
    if (this.state.showToPicker) {
      this.setState({
        to_date:
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate(),
        dobProvided: date,
        showToPicker: false,
      });
    }
  };
  setOpen = open => {
    console.log('open', open);
    this.setState({
      open,
    });
  };

  setValue = callback => {
    this.setState(state => ({
      value: callback(state.value),
    }));
  };

  setItems = callback => {
    this.setState(state => ({
      items: callback(state.items),
    }));
  };
  handleOnchange = data => {
    console.log('change', data);
    this.setState({[type]: data});
  };
  getTotalAmountInDate = () => {
    this.setState({getTotalLoader: true});
    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/get-total-amount`,
        {
          fromDate: this.state.from_date,
          toDate: this.state.to_date,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        console.log('response', response.data);
        ToastAndroid.show('amount fetched', ToastAndroid.SHORT);
        this.setState({getTotalLoader: false});

        this.setState({
          amountReceived: response.data && response.data.amount_received,
          amountSent: response.data && response.data.amount_sent,
        });
      })
      .catch(e => {
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({getTotalLoader: false});
      });
  };
  getTotalAmountPerMonth = () => {
    this.setState({fetchtingTotalAvg: true});
    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/amount-per-month`,
        {
          month: this.state.value,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        console.log('response', response.data);
        this.setState({fetchtingTotalAvg: false});
        ToastAndroid.show('Data Fetched', ToastAndroid.SHORT);

        this.setState({
          totalAvgObjPerMonth: response.data,
        });
      })
      .catch(e => {
        console.log('e', e.response.data);
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({fetchtingTotalAvg: false});
      });
  };
  getMaxTransaction = () => {
    this.setState({maxtransactionLoader: true});
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/max-amount-for-month`,
        {
          month: this.state.value,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        console.log('response max amount', response.data);
        this.setState({maxtransactionLoader: false});
        ToastAndroid.show('Data Fetched', ToastAndroid.SHORT);

        this.setState({
          maxAmountObjPerMonth: response.data,
        });
      })
      .catch(e => {
        this.setState({maxtransactionLoader: false});
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
      });
  };
  render() {
    console.log('this.state', this.state.maxAmountObjPerMonth);
    const {open, value, items} = this.state;

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            justifyContent: 'flex-start',
          }}>
          <Icon3
            name="left"
            size={20}
            color="#fff"
            style={{marginRight: 8}}
            onPress={() => {
              this.props.navigation && this.props.navigation.navigate('Home');
            }}
          />
          <Text style={{color: '#fff', fontWeight: '600', fontSize: 20}}>
            Transaction Amount
          </Text>
        </View>
        {this.state.showFromPicker || this.state.showToPicker ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            maximumDate={new Date()}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={this.onChange}
          />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            alignItems: 'center',
            marginTop: 25,
          }}>
          <View style={{width: '40%'}}>
            <TouchableOpacity
              onPress={() => {
                this.setState({showFromPicker: true});
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: '#fff',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Icon
                  name="calendar"
                  size={12}
                  color="#fff"
                  style={{marginRight: 8}}
                />
                <Text style={{color: '#fff'}}>
                  {this.state.from_date ? this.state.from_date : 'From'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Icon2 name="arrow-swap" size={12} color="#fff" style={{}} />
          <View style={{width: '40%'}}>
            <TouchableOpacity
              onPress={() => {
                this.setState({showToPicker: true});
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: '#fff',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Icon
                  name="calendar"
                  size={12}
                  color="#fff"
                  style={{marginRight: 8}}
                />
                <Text style={{color: '#fff'}}>
                  {this.state.to_date ? this.state.to_date : 'To'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.buttonContainer, {marginTop: 25}]}>
          <TouchableOpacity
            onPress={() => {
              this.getTotalAmountInDate();
            }}>
            {this.state.getTotalLoader ? (
              <ActivityIndicator color={'silver'} size="small" />
            ) : (
              <Text style={{color: '#fff', textAlign: 'center', fontSize: 16}}>
                Get Total
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
          }}>
          {this.state.amountReceived ?<View
            style={{
              paddingVertical: 5,
              width: '45%',
              backgroundColor: '#fff',
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <Text style={{color: '#53B64B', fontSize: 24, fontWeight: '700',marginBottom:10}}>
              {this.state.amountReceived ? this.state.amountReceived : '-'}
            </Text>
            <Text style={{ color: '#0D0D0D', fontSize: 10,textAlign:'center'}}>
              Total Amount Received{' '}
            </Text>
          </View>
          :null}
          {this.state.amountSent?<View
            style={{
              paddingVertical: 5,
              width: '45%',
              backgroundColor: '#fff',
              borderRadius: 6,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <Text style={{color: '#ED3833', fontSize: 24, fontWeight: '700',marginBottom:10}}>
              {this.state.amountSent ? this.state.amountSent : '-'}
            </Text>
            <Text style={{ color: '#0D0D0D', fontSize: 10,textAlign:'center'}}>
              Total Amount Sent{' '}
            </Text>
          </View>
          :null}
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

export default connect(mapStateToProps, actions, null)(Statement);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#343244',
    paddingTop: 30,
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
    alignSelf: 'center',
    width: '90%',
    borderWidth: 0.5,
    borderColor: '#FFF',
  },
});
