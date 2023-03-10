import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../actions';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const user = require('../assets/user.png');

class Messenger extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message_list: null,
    };
  }
  componentDidMount = () => {
    this.fetchdata();
  };
  fetchdata = () => {
    const uid = this.props.login?.uid;
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        console.log('querySnapshot', querySnapshot);
        let users = [];
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id != uid)
            users.push({
              uid: documentSnapshot.id,
              username: documentSnapshot.data().username,
              profileImg: documentSnapshot.data().profileImg,
            });
          this.setState({message_list: users});
        });
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Icon
            name="chevron-back"
            size={28}
            color="#000"
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={styles.label}> Messenger</Text>
        </View>
        <ScrollView>
          {this.state.message_list?.map((ele, i) => {
            console.log('ele', ele);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  this.props.navigation.navigate('Chat', {
                    friend_id: ele.uid,
                    friendName: ele.username,
                    friendImg: ele.profileImg,
                  });
                }}>
                <View style={styles.listItem}>
                  {ele?.profileImg?.length > 0 ? (
                    <Image
                      source={{uri: ele.profileImg}}
                      style={styles.profileImg}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      style={styles.profileImg}
                      source={user}
                      resizeMode="contain"
                    />
                  )}
                  <View>
                    <Text style={styles.label}>{ele.username}</Text>
                    <Text style={styles.message}>Message</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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

export default connect(mapStateToProps, actions, null)(Messenger);
const styles = StyleSheet.create({
  container: {},
  label: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    color: 'grey',
  },
  top: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    borderWidth: 0.5,
    borderColor: 'grey',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 8,
    alignItems: 'center',
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    alignSelf: 'center',
    marginRight: 10,
  },
});
