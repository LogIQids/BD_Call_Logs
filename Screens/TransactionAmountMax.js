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
import Icon from 'react-native-vector-icons/FontAwesome';
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
      display: 'max',
    };
  }
  componentDidMount() {}
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
    console.log('this.state', this.state.display);
    const {open, value, items} = this.state;

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            justifyContent: 'flex-start',
            marginBottom: 30,
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
            Total,Avg and Max Transaction Amount
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 15}}>
          <TouchableOpacity
            style={{width: '50%'}}
            onPress={() => {
              this.setState({display: 'total_avg',maxAmountObjPerMonth:null});
            }}>
            <Text
              style={{
                backgroundColor: '#4A4861',
                color: '#fff',
                paddingVertical: 10,
                textAlign: 'center',
                borderRadius: 4,
                borderColor:this.state.display=='total_avg'?'#fff':null,
                borderWidth:this.state.display=='total_avg'?1:null
              }}>
              Total and Average
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: '50%'}}
            onPress={() => {
              this.setState({display: 'max',totalAvgObjPerMonth:null});
            }}>
            <Text
              style={{
                backgroundColor: '#4A4861',
                color: '#fff',
                paddingVertical: 10,
                textAlign: 'center',
                borderRadius: 4,
                borderColor:this.state.display=='max'?'#fff':null,
                borderWidth:this.state.display=='max'?1:null
              }}>
              Maximum
            </Text>
          </TouchableOpacity>
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

        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={this.setOpen}
          setValue={this.setValue}
          setItems={this.setItems}
          containerProps={{
            height: 70,
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
        />
        {this.state.display == 'total_avg' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.getTotalAmountPerMonth();
                }}>
                {this.state.fetchtingTotalAvg ? (
                  <ActivityIndicator color={'silver'} size="small" />
                ) : (
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Get Total/Avg Per Month
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {this.state.totalAvgObjPerMonth ? (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <View
              style={{
                paddingVertical: 5,
                width: '45%',
                backgroundColor: '#fff',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  color: '#53B64B',
                  fontSize: 24,
                  fontWeight: '700',
                  marginBottom: 5,
                }}>
                {this.state.totalAvgObjPerMonth.average_amount_received
                  ? this.state.totalAvgObjPerMonth.average_amount_received
                  : '-'}
              </Text>
              <Text
                style={{color: '#0D0D0D', fontSize: 10, textAlign: 'center'}}>
                Avg amount received{' '}
              </Text>
            </View>

            <View
              style={{
                paddingVertical: 5,
                width: '45%',
                backgroundColor: '#fff',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  color: '#ED3833',
                  fontSize: 24,
                  fontWeight: '700',
                  marginBottom: 5,
                }}>
                {this.state.totalAvgObjPerMonth.average_amount_sent
                  ? this.state.totalAvgObjPerMonth.average_amount_sent
                  : '-'}
              </Text>
              <Text
                style={{color: '#0D0D0D', fontSize: 10, textAlign: 'center'}}>
                Avg amount sent{' '}
              </Text>
            </View>
          </View>
        ) : null}
        {this.state.totalAvgObjPerMonth ? (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <View
              style={{
                paddingVertical: 5,
                width: '45%',
                backgroundColor: '#fff',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  color: '#53B64B',
                  fontSize: 24,
                  fontWeight: '700',
                  marginBottom: 5,
                }}>
                {this.state.totalAvgObjPerMonth.total_amount_received
                  ? this.state.totalAvgObjPerMonth.total_amount_received
                  : '-'}
              </Text>
              <Text
                style={{color: '#0D0D0D', fontSize: 10, textAlign: 'center'}}>
                Total amount received{' '}
              </Text>
            </View>

            <View
              style={{
                paddingVertical: 5,
                width: '45%',
                backgroundColor: '#fff',
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  color: '#ED3833',
                  fontSize: 24,
                  fontWeight: '700',
                  marginBottom: 5,
                }}>
                {this.state.totalAvgObjPerMonth.total_amount_sent
                  ? this.state.totalAvgObjPerMonth.total_amount_sent
                  : '-'}
              </Text>
              <Text
                style={{color: '#0D0D0D', fontSize: 10, textAlign: 'center'}}>
                Total amount sent{' '}
              </Text>
            </View>
          </View>
        ) : null}

        {this.state.display == 'max' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.getMaxTransaction();
                }}>
                {this.state.maxtransactionLoader ? (
                  <ActivityIndicator color={'silver'} size="small" />
                ) : (
                  <Text style={{color: '#fff', textAlign: 'center'}}>
                    Get Max Transaction
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <View style={{marginTop: 15,width:'96%'}}>
          {this.state.maxAmountObjPerMonth &&
            this.state.maxAmountObjPerMonth.map(a => (
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
                  width: '100%',
                }}>
                <Text style={{color: '#0d0d0d'}}>{a.sender}</Text>
                <View style={{alignItems: 'center'}}>
                  <Icon
                    name="long-arrow-right"
                    size={20}
                    color="#0d0d0d"
                    style={{}}
                    onPress={() => {}}
                  />
                  <Text style={{color: '#0d0d0d'}}>{a.amount}</Text>
                </View>
                <Text style={{color: '#0d0d0d'}}>{a.receiver}</Text>
              </View>
            ))}
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
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#343244',
    paddingTop: 30,
    flex: 1,
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
