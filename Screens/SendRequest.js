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
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Ionicons';

import {connect} from 'react-redux';
import * as actions from '../actions';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const contact = require('../assets/contact.png');

class SendRequest extends React.Component {
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
    };
  }
  componentDidMount() {}
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
  renderRequestModal = () => {
  
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
          </View>
      </Modal>
    );
  };
  requestMoney = () => {
    this.setState({requestMoneyLoader: true});
    const userId =
      this.props.login &&
      this.props.login.session_token &&
      this.props.login.session_token.userId;
    axios
      .post(
        `https://harshal-trasactions-project.herokuapp.com/user/${userId}/request-money`,
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
        return money;
      case 2:
        return (
          this.props.navigation &&
          this.props.navigation.navigate('monthly_statement')
        );
      case 3:
        return (
          this.props.navigation &&
          this.props.navigation.navigate('transaction_history')
        );
      case 4:
        return amount;
      case 5:
        return average;
      case 6:
        return (
          this.props.navigation && this.props.navigation.navigate('best_users')
        );
      default:
        return;
    }
  };
  renderSendModal=()=>{
    return (
      <Modal
        animationInTiming={800}
        animationOutTiming={600}
        backdropTransitionInTiming={700}
        backdropTransitionOutTiming={400}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        isVisible={this.state.sendModal}
        style={{
          width: '100%',
          justifyContent: 'flex-end',
          margin: 0,
          flexDirection: 'column',
          zIndex: 1,
        }}
        onBackButtonPress={() => {
          this.setState({sendModal: false});
        }}
        statusBarTranslucent={true}
        onBackdropPress={() => {
          this.setState({sendModal: false});
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
          <Text style={{color:'#2F2C3D',fontSize:16,fontWeight:'600'}}>Paying {this.state.email_phone}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: '#0d0d0d',
              marginBottom: 20,
              borderRadius:8
            }}>
            <Icon2
              name="comment"
              size={17}
              color="#2F2C3D"
              style={{marginRight: 10}}
            />
            <TextInput
              placeholder="Comment"
              style={{
                flex: 0.98,
                justifyContent: 'center',
                alignItems: 'center',
                color: '#2F2C3D',
              }}
              onChangeText={text => this.handleOnchange('comment', text)}
              placeholderTextColor="#2F2C3D"
              value={this.state.comment}
            />
          </View>
        </View>
      </Modal>
    );
  }
  render() {
    const {open, value, items} = this.state;
    const {openSearch, valueSearch, itemsSearch} = this.state;
    const {transactionOpen, valueTransaction, transactionItems} = this.state;
    console.log('statementData', this.props);
    return (
      <View style={styles.container}>
        {this.renderSendModal()}
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
            Send/Request Money
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            borderBottomWidth: 1,
            borderBottomColor: '#fff',
            marginTop: 20,
          }}>
          <Image
            source={contact}
            style={{width: 17, height: 17}}
            resizeMode="contain"
          />
          <TextInput
            placeholder="Enter Email/Phone"
            style={[
              {
                flex: 0.98,
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
              },
            ]}
            onChangeText={text => this.handleOnchange('email_phone', text)}
            value={this.state.email_phone}
            placeholderTextColor="#fff"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            alignItems: 'center',
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
            placeholder="Select Transaction Mode"
          />
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            alignItems: 'center',
          }}>
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
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({sendModal: true});
              }}>
              <Text style={{color: '#fff', textAlign: 'center'}}>Send</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({requestModal: true});
              }}>
              <Text style={{color: '#fff', textAlign: 'center'}}>Request</Text>
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

export default connect(mapStateToProps, actions, null)(SendRequest);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#343244',
    paddingTop: 30,
    alignItems: 'center',
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
    width: '40%',
    marginTop: 30,
    borderWidth: 0.5,
    borderColor: '#FFF',
  },
});
