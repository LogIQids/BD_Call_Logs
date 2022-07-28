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
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Fontisto';
import moment from 'moment';

// import LQDropdown from '../components/LQDropdown';
import {connect} from 'react-redux';
import * as actions from '../actions';
var axios = require('axios');

class MonthlyStatement extends React.Component {
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
  componentDidMount() {}

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

  getStatement = () => {
    this.setState({statementLoader: true});

    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/transactions`,
        {month: this.state.value},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        this.setState({statementLoader: false, statementData: response.data});
        console.log('response request', response.data);
        if (typeof response.data == 'string') {
          ToastAndroid.show(response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Statement Fetched', ToastAndroid.SHORT);
        }
      })
      .catch(e => {
        console.log('e', e.response.data);
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({statementLoader: false});
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
          <Icon
            name="left"
            size={20}
            color="#fff"
            style={{marginRight: 8}}
            onPress={() => {
              this.props.navigation && this.props.navigation.navigate('Home');
            }}
          />
          <Text style={{color: '#fff', fontWeight: '600', fontSize: 20}}>
            Monthly Statement
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={this.setOpen}
            setValue={this.setValue}
            setItems={this.setItems}
            containerProps={{}}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
          />
        </View>
        <View
          style={[
            styles.buttonContainer,
            {alignSelf: 'center', marginTop: 25},
          ]}>
          <TouchableOpacity
            onPress={() => {
              this.getStatement();
            }}>
            {this.state.statementLoader ? (
              <ActivityIndicator color={'silver'} size="small" />
            ) : (
              <Text style={{color: '#fff', textAlign: 'center'}}>
                Get Statement
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 15}}>
          {this.state.statementData &&
            this.state.statementData.map(a => (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                  borderRadius: 6,
                  marginBottom: 10,
                  alignItems: 'center',
                  padding: 8,
                  justifyContent: 'space-between',
                  shadowColor: '#171717',
                  shadowOffset: {width: -2, height: 4},
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}>
                <View style={{flex: 0.65}}>
                  <Text
                    style={{
                      color: '#343244',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                    {a.name}
                  </Text>
                  <Text
                    style={{
                      color: '#707070',
                      fontSize: 10,
                    }}>
                    {moment(a.transaction_date).format('MMMM Do YYYY')}
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#343244',
                    fontSize: 12,
                    flex: 0.3,
                    textAlign: 'left',
                  }}>
                  {a.mode == 'credit_card'
                    ? 'Credit Card'
                    : a.mode == 'debit_card'
                    ? 'Debit card'
                    : a.mode == 'upi'
                    ? 'UPI'
                    : a.mode}
                </Text>
                <Text
                  style={{
                    color: a.type == 'debit' ? '#ED3833' : '#53B64B',
                    fontSize: 14,
                    fontWeight: '600',
                    flex: 0.3,
                    textAlign: 'right',
                  }}>
                  INR {a.amount}
                </Text>
              </View>
            ))}
        </ScrollView>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

export default connect(mapStateToProps, actions, null)(MonthlyStatement);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
