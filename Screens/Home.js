import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
var axios = require('axios');
import moment from 'moment';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon4 from 'react-native-vector-icons/Ionicons';

import {connect} from 'react-redux';
import * as actions from '../actions';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const money = require('../assets/money-transfer.png');
const statement = require('../assets/bank-statement.png');
const history = require('../assets/transaction-history.png');
const amount = require('../assets/amount.png');
const users = require('../assets/bestUsers.png');
const average = require('../assets/average.png');

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      text: '',
      open: false,
      openSearch: false,
      value: null,
      email_phone: '',
      amount: '',
      from_date: '',
      to_date: '',
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
      itemsSearch: [
        {label: 'SSN', value: 'ssn'},
        {label: 'Email', value: 'email'},
        {label: 'Phone Number', value: 'phone'},
        {label: 'Type of transaction', value: 'type'},
        {label: 'Time/Date', value: 'time'},
      ],
      transactionItems: [
        {label: 'Credit Card', value: 'credit_card'},
        {label: 'Debit Card', value: 'debit_card'},
        {label: 'UPI', value: 'upi'},
      ],
      Identifiers: [
        {label: 'Email', value: 'email'},
        {label: 'Phone', value: 'phone'},
      ],
      selectedMonth: null,
      services: [
        {id: 1, name: 'Send/Request Money', route: 'send_request'},
        {id: 2, name: 'Monthly Statement', route: 'monthly_statement'},
        {id: 3, name: 'Transaction History', route: 'transaction_history'},
        {id: 4, name: 'Transaction Amount', route: 'transaction_amount'},
        {
          id: 5,
          name: 'Get Total,Avg and Max Transaction',
          route: 'transaction_amount_max',
        },
        {id: 6, name: 'Best Users', route: 'best_users'},
      ],
    };
  }
  componentDidMount() {
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
        this.fetchRequests();
        this.setState({userData: response.data});
      })
      .catch(e => console.log('op', e));
  }
  handleClassSelection = value => {
    console.log('value', value);
    this.setState({
      selectedMonth: value,
    });
  };
  handleOnchange = (type, data) => {
    this.setState({[type]: data});
  };
  sendMoney = () => {
    this.setState({sendMoneyLoader: true});
    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/send-money`,
        {
          amount: Number(this.state.amount),
          transactionMode: this.state.valueTransaction,
          receiverIdentifier: this.state.valueIdentifier,
          receiver: this.state.email_phone,
          comments: this.state.comment,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        this.setState({sendMoneyLoader: false});
        console.log('response request', response.data);
        if (typeof response.data == 'string') {
          ToastAndroid.show(response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Money Requested', ToastAndroid.SHORT);
        }
      })
      .catch(e => {
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({sendMoneyLoader: false});
      });
  };
  acceptReject = (id, action) => {
    this.setState({acceptRejectLoader: true});
    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/accept-request`,
        {
          requestId: id,
          transactionMode: 'upi',
          action: action,
          comments: 'done',
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        this.setState({acceptRejectLoader: false, requestsData: null});
        console.log('response', response.data);
        ToastAndroid.show(response.data, ToastAndroid.SHORT);
      })
      .catch(e => {
        console.log('e', e.response);
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({acceptRejectLoader: false, requestsData: null});
      });
  };
  renderModal = () => {
    console.log('requestsData', this.state.requestsData);
    return (
      <Modal
        animationInTiming={800}
        animationOutTiming={600}
        backdropTransitionInTiming={700}
        backdropTransitionOutTiming={400}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        isVisible={this.state.showRequest}
        style={{
          width: '100%',
          justifyContent: 'flex-end',
          margin: 0,
          flexDirection: 'column',
          zIndex: 1,
        }}
        onBackButtonPress={() => {
          this.setState({showRequest: false});
        }}
        statusBarTranslucent={true}
        onBackdropPress={() => {
          this.setState({showRequest: false});
        }}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            maxHeight: screenHeight * 0.8,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}>
          <View
            style={{
              width: 70,
              borderBottomColor: '#E9ECEF',
              borderBottomWidth: 8,
              position: 'absolute',
              alignSelf: 'center',
              borderRadius: 8,
            }}></View>
          <Text style={{color: '#343A40', fontSize: 20, fontWeight: '700'}}>
            Requests
          </Text>
          <View
            style={{
              width: screenWidth,
              borderBottomColor: '#E9ECEF',
              borderBottomWidth: 1,
              alignSelf: 'center',
              marginTop: 20,
            }}></View>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}>
            {this.state.requestsData &&
              this.state.requestsData.map(a => (
                <View
                  style={{
                    borderWidth: 1,
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: '#E9ECEF',
                    // a.status == 'active'
                    //   ? '#E9ECEF'
                    //   : a.status == 'accepted'
                    //   ? '#53B64B'
                    //   : '#ED3833',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="user"
                    size={20}
                    color="#6C757D"
                    style={{marginRight: 8}}
                  />
                  <View style={{flex: 0.96}}>
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          color: '#0D0D0D',
                          fontWeight: '600',
                          fontSize: 16,
                        }}>
                        {a.request_sender}{' '}
                      </Text>
                      <Text style={{color: '#0D0D0D', fontSize: 14}}>
                        requested{' '}
                      </Text>
                      <Text
                        style={{
                          color: '#0D0D0D',
                          fontWeight: '600',
                          fontSize: 16,
                        }}>
                        INR {a.amount}
                      </Text>
                    </View>
                    {a.comments !== '' ? (
                      <Text
                        style={{
                          color: '#6C757D',
                          fontSize: 14,
                          fontStyle: 'italic',
                        }}>
                        {a.comments}
                      </Text>
                    ) : null}
                  </View>
                  {a.status !== 'active' ? (
                    a.status == 'accepted' ? (
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon2
                          name="check"
                          size={20}
                          color="#53B64B"
                          style={{marginRight: 8}}
                        />
                        <Text
                          style={{
                            color: '#53B64B',
                            paddingVertical: 10,
                          }}>
                          Accepted
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon2
                          name="close"
                          size={20}
                          color="#ED3833"
                          style={{marginRight: 8}}
                        />
                        <Text
                          style={{
                            color: '#ED3833',
                            paddingVertical: 10,
                          }}>
                          Rejected
                        </Text>
                      </View>
                    )
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                      <View
                        style={[
                          {
                            backgroundColor: '#53B64B',
                            padding: 10,
                            borderRadius: 15,
                            marginRight: 8,
                          },
                        ]}>
                        <TouchableOpacity
                          onPress={() => {
                            this.acceptReject(a.request_id, 'accept');
                          }}>
                          {this.state.acceptRejectLoader ? (
                            <ActivityIndicator color={'silver'} size="small" />
                          ) : (
                            <Icon2
                              name="check"
                              size={20}
                              color="#fff"
                              style={{}}
                            />
                          )}
                        </TouchableOpacity>
                      </View>

                      <View
                        style={[
                          {
                            backgroundColor: '#ED3833',
                            padding: 10,
                            borderRadius: 15,
                          },
                        ]}>
                        <TouchableOpacity
                          onPress={() => {
                            this.acceptReject(a.request_id, 'reject');
                          }}>
                          {this.state.acceptRejectLoader ? (
                            <ActivityIndicator color={'silver'} size="small" />
                          ) : (
                            <Icon2
                              name="close"
                              size={20}
                              color="#fff"
                              style={{}}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ))}
          </ScrollView>
        </View>
      </Modal>
    );
  };
  requestMoney = () => {
    this.setState({requestMoneyLoader: true});
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${this.props.id}/request-money`,
        {
          amount: Number(this.state.amount),
          receiverIdentifier: this.state.valueIdentifier,
          receiver: this.state.email_phone,
          comments: this.state.comment,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        this.setState({requestMoneyLoader: false});
        console.log('response request', response.data);
        if (typeof response.data == 'string') {
          ToastAndroid.show(response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Money Requested', ToastAndroid.SHORT);
        }
      })
      .catch(e => {
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({requestMoneyLoader: false});
      });
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
  setIdentifierOpen = open => {
    console.log('', open);
    this.setState({
      openIdentifier: open,
    });
  };

  setValueIdentifier = callback => {
    this.setState(state => ({
      valueIdentifier: callback(state.valueTransaction),
    }));
  };

  setIdentifierItem = callback => {
    this.setState(state => ({
      Identifiers: callback(state.Identifiers),
    }));
  };
  getStatement = () => {
    this.setState({statementLoader: true});
    console.log('this.state.value', this.state.value);
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${this.props.id}/transactions`,
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
  fetchRequests = () => {
    this.setState({fetchRequestLoader: true});
    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .get(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/requests`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
      .then(response => {
        this.setState({fetchRequestLoader: false});
        console.log('response request', response.data);
        // if (response.data && response.data.length == 0) {
        //   ToastAndroid.show('No requests found', ToastAndroid.SHORT);
        // } else {
        //   this.setState({requestsData: response.data});
        //   ToastAndroid.show('Requests Fetched', ToastAndroid.SHORT);
        // }
      })
      .catch(e => {
        if (typeof e.response.data == 'string') {
          ToastAndroid.show(e.response.data, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.response.data.error, ToastAndroid.SHORT);
        }
        this.setState({fetchRequestLoader: false});
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
  searchTransaction = () => {
    this.setState({searchLoader: true});
    let params = '';
    console.log('searchValue', this.state.valueTransaction);
    if (this.state.valueSearch == 'email') {
      params = `?receiverEmail=${this.state.searchValue}`;
    } else if (this.state.valueSearch == 'phone') {
      params = `?receiverPhone=${this.state.searchValue}`;
    } else if (this.state.valueSearch == 'ssn') {
      params = `?userId=${this.state.searchValue}`;
    } else if (this.state.valueSearch == 'type') {
      if (this.state.valueTransaction == 'credit_card') {
        params = `?type=credit`;
      } else if (this.state.valueTransaction == 'debit_card') {
        params = `?type=debit`;
      } else {
        params = `?type=upi`;
      }
    }
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${this.props.id}/transactions${params}`,
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
  getServiceIcon = id => {
    switch (id) {
      case 1:
        return money;
      case 2:
        return statement;
      case 3:
        return history;
      case 4:
        return amount;
      case 5:
        return average;
      case 6:
        return users;
      default:
        return;
    }
  };
  navigateToScreen = id => {
    switch (id) {
      case 1:
        return this.props.navigation && this.props.navigation.navigate('send_request');
      case 2:
        return this.props.navigation && this.props.navigation.navigate('monthly_statement')
      case 3:
        return this.props.navigation && this.props.navigation.navigate('transaction_history');
      case 4:
        return this.props.navigation && this.props.navigation.navigate('transaction_amount');
      case 5:
        return this.props.navigation && this.props.navigation.navigate('transaction_amount_max');
      case 6:
        return this.props.navigation && this.props.navigation.navigate('best_users');
      default:
        return;
    }
  };
  render() {
    const {open, value, items} = this.state;
    const {openSearch, valueSearch, itemsSearch} = this.state;
    const {transactionOpen, valueTransaction, transactionItems} = this.state;
    console.log('statementData', this.props );
    return (
      <View style={styles.container}>
        {this.renderModal()}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            paddingTop: 15,
            backgroundColor: '#4A4861',
            paddingHorizontal: 15,
            paddingBottom: 15,
            position: 'absolute',
            top: 0,
            zIndex: 999,
            shadowColor: '#171717',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}>
          <Text style={{fontSize: 20, color: '#fff', fontWeight: '700'}}>
            Hi, {this.state.userData && this.state.userData.name}
          </Text>
          <Icon4
            name="notifications"
            size={25}
            color="#fff"
            onPress={() => this.setState({showRequest: true})}
          />
        </View>
        <ScrollView style={{paddingTop: 50}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 15,
              height:screenHeight
            }}>
            {this.state.services &&
              this.state.services.map(item => {
                return (
                  <TouchableOpacity
                    style={{width: '45%'}}
                    onPress={() => {
                      this.navigateToScreen(item.id)
                    }}>
                    <View
                      style={{
                        // flex: 0.5,
                        width: '90%',
                        paddingVertical: 15,
                        borderRadius: 8,
                        backgroundColor: '#4A4861',
                        marginHorizontal: 10,
                        marginVertical: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#171717',
                        shadowOffset: {width: -2, height: 4},
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 10,
                        minHeight:'20%'
                      }}>
                      <Image
                        source={this.getServiceIcon(item.id)}
                        style={{with: 40, height: 40, marginBottom: 10}}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '600',
                          fontSize: 16,
                          textAlign: 'center',
                        }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', marginRight: 20, width: '40%'}}>
              Amount:
            </Text>

            <TextInput
              placeholder="Enter Amount"
              style={[
                {
                  width: '50%',
                  marginVertical: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  color: '#000',
                  backgroundColor: '#fff',
                },
              ]}
              onChangeText={text => this.handleOnchange('amount', text)}
              value={this.state.amount}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', marginRight: 20, width: '40%'}}>
              Select Identifier:
            </Text>
            <DropDownPicker
              open={this.state.openIdentifier}
              value={this.state.valueIdentifier}
              items={this.state.Identifiers}
              setOpen={this.setIdentifierOpen}
              setValue={this.setValueIdentifier}
              setItems={this.setIdentifierItem}
              containerProps={{zIndex: 99999999999999999, width: '50%'}}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>
          {this.state.valueIdentifier ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', marginRight: 20, width: '40%'}}>
                Enter {this.state.valueIdentifier}
              </Text>

              <TextInput
                placeholder={`Enter ${this.state.valueIdentifier}`}
                style={[
                  {
                    width: '50%',
                    marginVertical: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    color: '#000',
                    backgroundColor: '#fff',
                  },
                ]}
                onChangeText={text => this.handleOnchange('email_phone', text)}
                value={this.state.email_phone}
              />
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', marginRight: 20, width: '40%'}}>
              Comment
            </Text>

            <TextInput
              placeholder={`Enter Comment`}
              style={[
                {
                  width: '50%',
                  marginVertical: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  color: '#000',
                  backgroundColor: '#fff',
                },
              ]}
              onChangeText={text => this.handleOnchange('comment', text)}
              value={this.state.comment}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', marginRight: 20, width: '40%'}}>
              Transaction Mode:
            </Text>
            <DropDownPicker
              open={transactionOpen}
              value={valueTransaction}
              items={transactionItems}
              setOpen={this.setTransactionOpen}
              setValue={this.setValueTransaction}
              setItems={this.setTransactionItem}
              containerProps={{zIndex: 9999999, width: '50%'}}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.sendMoney();
                }}>
                {this.state.sendMoneyLoader ? (
                  <ActivityIndicator color={'silver'} size="small" />
                ) : (
                  <Text style={{color: '#fff', textAlign: 'center'}}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.requestMoney();
                }}>
                {this.state.requestMoneyLoader ? (
                  <ActivityIndicator color={'silver'} size="small" />
                ) : (
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Request
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{fontSize: 17, color: '#fff', paddingVertical: 15}}>
            Statements
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          <View style={{flexDirection: 'row'}}>
            {this.state.statementData &&
              Object.keys(this.state.statementData) &&
              Object.keys(this.state.statementData[0]).map(a => (
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a}
                </Text>
              ))}
          </View>
          {this.state.statementData &&
            this.state.statementData.map(a => (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.transaction_id}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.account_id}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.name}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.type}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.amount}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {moment(a.transaction_date).format('MMMM Do YYYY')}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.mode}
                </Text>
              </View>
            ))}
          <Text style={{fontSize: 17, color: '#fff', paddingVertical: 15}}>
            Search Transactions
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              alignItems: 'center',
            }}>
            <Text style={{color: '#fff', marginRight: 20, width: '40%'}}>
              Type of Search
            </Text>
            <DropDownPicker
              open={openSearch}
              value={valueSearch}
              items={itemsSearch}
              setOpen={this.setOpenSearch}
              setValue={this.setValueSearch}
              setItems={this.setItemsSearch}
              containerProps={{
                width: '50%',
              }}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>
          {this.state.valueSearch !== 'type' &&
          this.state.valueSearch !== 'time' &&
          this.state.valueSearch !== undefined ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', marginRight: 20, width: '40%'}}>
                Enter {valueSearch}
              </Text>
              <TextInput
                placeholder={`Enter ${valueSearch}`}
                style={[
                  {
                    width: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    color: '#000',
                    backgroundColor: '#fff',
                  },
                ]}
                onChangeText={text => this.handleOnchange('searchValue', text)}
                value={this.state.searchValue}
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
              }}>
              <View style={{width: '40%'}}>
                <Text style={{color: '#fff'}}>From Date</Text>
                <TextInput
                  style={[
                    {
                      width: '100%',
                      marginVertical: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      color: '#000',
                      backgroundColor: '#fff',
                    },
                  ]}
                  onFocus={() => this.setState({showFromPicker: true})}
                  // onChangeText={text => this.handleOnchange('from_date', text)}
                  value={this.state.from_date}
                />
              </View>
              <View style={{width: '40%'}}>
                <Text style={{color: '#fff'}}>To Date</Text>
                <TextInput
                  style={[
                    {
                      width: '100%',
                      marginVertical: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      color: '#000',
                      backgroundColor: '#fff',
                    },
                  ]}
                  onFocus={() => this.setState({showToPicker: true})}
                  // onChangeText={text => this.handleOnchange('to_date', text)}
                  value={this.state.to_date}
                />
              </View>
            </View>
          ) : null}
          {this.state.valueSearch == 'type' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', marginRight: 20, width: '40%'}}>
                Transaction Mode:
              </Text>
              <DropDownPicker
                open={transactionOpen}
                value={valueTransaction}
                items={transactionItems}
                setOpen={this.setTransactionOpen}
                setValue={this.setValueTransaction}
                setItems={this.setTransactionItem}
                containerProps={{zIndex: 9999999, width: '50%'}}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
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
          <View style={{flexDirection: 'row'}}>
            {this.state.searchData &&
              Object.keys(this.state.searchData) &&
              Object.keys(this.state.searchData[0]).map(a => (
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a}
                </Text>
              ))}
          </View>
          {this.state.searchData &&
            this.state.searchData.map(a => (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.transaction_id}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.account_id}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.name}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.type}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.amount}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {moment(a.transaction_date).format('MMMM Do YYYY')}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    width: '15.2%',
                    textAlign: 'left',
                    paddingHorizontal: 2,
                    fontSize: 10,
                    borderWidth: 0.2,
                    borderColor: '#fff',
                  }}>
                  {a.mode}
                </Text>
              </View>
            ))}*/}
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

export default connect(mapStateToProps, actions, null)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#343244',
  },
  textInputStyle: {
    borderWidth: 1,
    width: '40%',
  },
  buttonContainer: {
    backgroundColor: '#000',
    color: '#fff',
    padding: 10,
    margin: 8,
    borderRadius: 5,
    width: '40%',
  },
});
