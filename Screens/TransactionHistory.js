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
} from 'react-native';
import React, {Component} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Fontisto';

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

  render() {
    console.log('this.state', this.state.bestUsers);

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
          {this.state.bestUsers &&
            this.state.bestUsers.map((a,i )=> {
              return (
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
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image
                      source={profile}
                      style={{width: 20, height: 20,marginRight:8}}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        color: '#343244',
                        fontSize: 14,
                        fontWeight: '600',
                      }}>
                      {i+1}. {a.name}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#0D0D0D',
                      fontSize: 14,
                      fontWeight: '600',
                      textAlign: 'right',
                    }}>
                    INR {a.total_transactions_amount}
                  </Text>
                </View>
              );
            })}
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
