import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import CallLogs from 'react-native-call-log';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';

const width = Dimensions.get('window').width;

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async taskDataArguments => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      const lastSyncTime = await AsyncStorage.getItem('lastSyncTime');
      lastSyncTime != null ? JSON.parse(lastSyncTime) : null;
      const jsonValue = await AsyncStorage.getItem('data');
      jsonValue != null ? JSON.parse(jsonValue) : null;
      let phoneData = JSON.parse(jsonValue);
      var dateOffset = 24 * 60 * 60 * 1000 * 2; //2 days
      const date = new Date();
      const fromDate = date.getTime() - dateOffset;
      const filter = new Date(JSON.parse(lastSyncTime)?.lastSyncTime).getTime()
        ? {
            minTimestamp: new Date(
              JSON.parse(lastSyncTime)?.lastSyncTime,
            ).getTime(),
          }
        : {
            minTimestamp: fromDate,
          };
      await CallLogs.load(-1, filter).then(async callArray => {
        let newCallArray = callArray.map(item => {
          return {
            call_type: item.type,
            phone: item.phoneNumber,
            call_time: new Date(item.dateTime).toISOString(),
            duration: item.duration,
            name: item.name,
            timestamp: item.timestamp,
            subscriptionId: item.viaPhoneNumber,
          };
        });
        newCallArray = newCallArray.filter(a => {
          if (a.subscriptionId.length > 2) return;
          else return a.subscriptionId == phoneData?.subscriptionId;
        });

        const data = {
          caller_phone: phoneData?.phoneNumber,
          call_logs: newCallArray,
        };
        const headers = {
          'Content-Type': 'application/json',
        };

        axios
          .post(
            'https://api.logiqids.com/v1/school_sales/upload-bd-call-logs/',
            data,
            {
              headers: headers,
            },
          )
          .then(async response => {
            const currentDate = new Date();
            const jsonDate = JSON.stringify({
              lastSyncTime: currentDate,
            });
            await AsyncStorage.setItem('lastSyncTime', jsonDate);
          })
          .catch(error => {
            console.log('error', error.response.data);
          });
      });
      await sleep(delay);
    }
  }).catch(() => {});
};
const options = {
  taskName: 'Example',
  taskTitle: 'LQ Call logs',
  taskDesc: 'Sync in Progress',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 3600000,
  },
};
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      simcardData: null,
      callLogs: [],
    };
  }
  async componentDidMount() {
    const jsonValue = await AsyncStorage.getItem('data');
    jsonValue != null ? this.setState({data: JSON.parse(jsonValue)}) : null;

    var dateOffset = 24 * 60 * 60 * 1000 * 2; //2 days
    const date = new Date();
    const fromDate = date.getTime() - dateOffset;

    const lastSyncTime = await AsyncStorage.getItem('lastSyncTime');
    lastSyncTime != null ? JSON.parse(lastSyncTime) : null;
    this.setState({lastSyncTime: JSON.parse(lastSyncTime)});

    const filter = new Date(JSON.parse(lastSyncTime)?.lastSyncTime).getTime()
      ? {
          minTimestamp: new Date(
            JSON.parse(lastSyncTime)?.lastSyncTime,
          ).getTime(),
        }
      : {
          minTimestamp: fromDate,
        };

    CallLogs.load(-1, filter)
      .then(callArray => {
        console.log('callArray', callArray);
        let newCallArray = callArray.map(item => {
          return {
            call_type: item.type,
            phone: item.phoneNumber,
            call_time: new Date(item.dateTime).toISOString(),
            duration: item.duration,
            name: item.name,
            timestamp: item.timestamp,
            subscriptionId: item.viaPhoneNumber,
          };
        });
        newCallArray = newCallArray.filter(a => {
          if (this.state.data?.subscriptionId == 'both') return;
          else return a.subscriptionId == this.state.data?.subscriptionId;
        });
        console.log('newCallArray', newCallArray);
        this.setState({callLogs: newCallArray});
      })
      .catch(() =>
        ToastAndroid.show('Could not call logs', ToastAndroid.SHORT),
      );
    await BackgroundService.stop();
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'Call logs Syncing',
    });
  }

  syncLogs = () => {
    this.setState({loading: true});
    const data = {
      caller_phone: this.props?.data?.phoneNumber,
      call_logs: this.state.callLogs,
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    axios
      .post(
        'https://api.logiqids.com/v1/school_sales/upload-bd-call-logs/',
        data,
        {
          headers: headers,
        },
      )
      .then(async response => {
        const currentDate = new Date();
        const jsonValue = JSON.stringify({
          lastSyncTime: currentDate,
        });
        await AsyncStorage.setItem('lastSyncTime', jsonValue);
        console.log('khkhsk', response.data.data);
        this.setState({
          loading: false,
          lastSyncTime: {lastSyncTime: currentDate},
        });
        ToastAndroid.show(
          response?.data?.data?.message || 'Sync successful',
          ToastAndroid.SHORT,
        );
      })
      .catch(error => {
        console.log('error', error.response.data);
        this.setState({loading: false});
        ToastAndroid.show("Couldn't sync", ToastAndroid.SHORT);
      });
  };
  render() {
    const {lastSyncTime} = this.state;
    console.log('lastSyncTime state', lastSyncTime?.lastSyncTime);
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.state.data?.subscriptionId == 'both'
            ? 'You have selected both sims'
            : `Your selected number is ${this.state?.data?.phoneNumber}`}
        </Text>
        {lastSyncTime && (
          <Text style={styles.text}>
            Last sync time :{' \n'}
            {new Date(lastSyncTime?.lastSyncTime).toLocaleString()}
          </Text>
        )}
        <TouchableOpacity onPress={() => this.syncLogs()}>
          <View style={styles.button}>
            {this.state.loading ? (
              <ActivityIndicator size={'small'} color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sync Logs</Text>
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

export default connect(mapStateToProps, actions, null)(Login);
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
    textAlign: 'center',
    lineHeight: 30,
    marginVertical: 15,
  },
});
