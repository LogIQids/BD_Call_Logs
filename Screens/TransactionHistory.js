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
  Image,
  Keyboard
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

const profile = require('../assets/profile.png');

class TransactionHistory extends React.Component {
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
      itemsSearch: [
        {label: 'SSN', value: 'ssn'},
        {label: 'Email', value: 'email'},
        {label: 'Phone Number', value: 'phone'},
        {label: 'Type of transaction', value: 'type'},
        {label: 'Time/Date', value: 'time'},
      ],
      transactionItems: [
        {label: 'Credit', value: 'credit'},
        {label: 'Debit', value: 'debit'},
      ],
    };
  }
  setOpenSearch = open => {
    console.log('', open);
    this.setState({
      openSearch: open,
    });
  };

  setValueSearch = callback => {
    this.setState(state => ({
      valueSearch: callback(state.valueSearch),
    }));
  };

  setItemsSearch = callback => {
    this.setState(state => ({
      itemsSearch: callback(state.itemsSearch),
    }));
  };
  setTransactionOpen = open => {
    console.log('', open);
    this.setState({
      transactionOpen: open,
    });
  };

  setValueTransaction = callback => {
    this.setState(state => ({
      valueTransaction: callback(state.valueTransaction),
    }));
  };

  setTransactionItem = callback => {
    this.setState(state => ({
      transactionItems: callback(state.transactionItems),
    }));
  };
  componentDidMount() {
    
   
  }
  handleOnchange = (type, data) => {
    this.setState({[type]: data});
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
  searchTransaction = () => {
    this.setState({searchLoader: true,searchData:null});
    const userId =
    this.props.login &&
    this.props.login.session_token &&
    this.props.login.session_token.userId;
    let params = '';
    console.log('searchValue', this.state.valueTransaction);
    if (this.state.valueSearch == 'email') {
      params = `?receiverEmail=${this.state.searchValue}`;
    } else if (this.state.valueSearch == 'phone') {
      params = `?receiverPhone=${this.state.searchValue}`;
    } else if (this.state.valueSearch == 'ssn') {
      params = `?userId=${this.state.searchValue}`;
    } else if (this.state.valueSearch == 'type') {
     params = `?type=${this.state.valueTransaction}`;
    }
    Keyboard.dismiss();

    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/transactions${params}`,
        this.state.valueSearch == 'time'
          ? {fromDate: this.state.from_date, toDate: this.state.to_date}
          : {},
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        this.setState({searchLoader: false, searchData: response.data});
        console.log('response request', response.data);
        if (typeof response.data == 'string') {
          ToastAndroid.show(response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Fetched data', ToastAndroid.SHORT);
        }
      })
      .catch(e => {
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({searchLoader: false});
      });
  };
  render() {
    console.log('this.state', this.state.bestUsers);
    const {openSearch, valueSearch, itemsSearch} = this.state;
    const {transactionOpen, valueTransaction, transactionItems} = this.state;

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
            Transaction History
          </Text>
        </View>
        <View style={{marginTop: 20}}>
        <DropDownPicker
              open={openSearch}
              value={valueSearch}
              items={itemsSearch}
              setOpen={this.setOpenSearch}
              setValue={this.setValueSearch}
              setItems={this.setItemsSearch}
              containerProps={{zIndex: 9999999, width: '95%'}}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              // style={{
              //   backgroundColor: '#343244',
              //   borderBottomColor: '#fff',
              //   borderWidth: 0,
              //   borderBottomWidth: 1,
              // }}
              // placeholderStyle={{
              //   color: '#fff',
              // }}
              // textStyle={{
              //   color: '#fff',
              // }}
              // listItemLabelStyle={{
              //   color: '#000',
              // }}
              // arrowIconStyle={{
              //   width: 20,
              //   height: 20,
              //   tintColor: '#fff',
              // }}
              placeholder="Select Transaction Mode"
            />
          </View>
          {this.state.valueSearch !== 'type' &&
          this.state.valueSearch !== 'time' &&
          this.state.valueSearch !== undefined ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '95%',
                borderBottomWidth: 1,
                borderBottomColor: '#fff',
                marginVertical: 15,
              }}>
              <TextInput
                placeholder={`Enter ${valueSearch}`}
                style={[
                  {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                  },
                ]}
                onChangeText={text => this.handleOnchange('searchValue', text)}
                value={this.state.searchValue}
                placeholderTextColor="#fff"
              />
            </View>
          ) : null}
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
          {this.state.valueSearch == 'time' ? (
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
          ) : null}
          {this.state.valueSearch == 'type' ? (
            <View
              style={{
               marginVertical:20
              }}>
              <DropDownPicker
                open={transactionOpen}
                value={valueTransaction}
                items={transactionItems}
                setOpen={this.setTransactionOpen}
                setValue={this.setValueTransaction}
                setItems={this.setTransactionItem}
                containerProps={{zIndex: 9999999, width: '95%'}}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                style={{
                  backgroundColor: '#343244',
                  borderBottomColor: '#fff',
                  borderWidth: 0,
                  borderBottomWidth: 1,
                }}
                placeholderStyle={{
                  color: '#fff',
                }}
                textStyle={{
                  color: '#fff',
                }}
                listItemLabelStyle={{
                  color: '#000',
                }}
                arrowIconStyle={{
                  width: 20,
                  height: 20,
                  tintColor: '#fff',
                }}
              />
            </View>
          ) : null}

          {this.state.valueSearch ? (
            <View style={[styles.buttonContainer, {alignSelf: 'center'}]}>
              <TouchableOpacity
                onPress={() => {
                  this.searchTransaction();
                }}>
                {this.state.searchLoader ? (
                  <ActivityIndicator color={'silver'} size="small" />
                ) : (
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Search
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
           <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 15}}>
          {this.state.searchData &&
            this.state.searchData.map(a => (
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

export default connect(mapStateToProps, actions, null)(TransactionHistory);

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
