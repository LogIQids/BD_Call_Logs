import React, {Component, Fragment} from 'react';
import {
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import SendIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import * as actions from '../actions';
import firestore from '@react-native-firebase/firestore';

const win = Dimensions.get('window');
const user = require('../assets/user.png');

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      chats: null,
      sending: false,
    };
  }

  componentDidMount() {
    const params = this.props.route?.params;
    this.fetchdata(params?.friend_id);
  }
  sendMessage = id => {
    const uid = this.props.login?.uid;
    firestore()
      .collection('Users')
      .doc(uid)
      .update({
        chats: firestore.FieldValue.arrayUnion({
          chat_text: this.state.text,
          from: 'user',
          friendId: id,
        }),
      })
      .then(() => {
        firestore()
          .collection('Users')
          .doc(id)
          .update({
            chats: firestore.FieldValue.arrayUnion({
              chat_text: this.state.text,
              from: 'friend',
              friendId: uid,
            }),
          })
          .then(() => {
            this.fetchdata(id);
          });
      });
  };
  fetchdata = id => {
    const uid = this.props.login?.uid;
    firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot._data);
        this.setState({
          chats: querySnapshot?._data?.chats?.filter(a => a.friendId == id),
          text: '',
        });
      });
  };
  render() {
    const {chats} = this.state;
    const params = this.props.route?.params;
    console.log('chats', chats);
    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
        }}>
        <View style={styles.top}>
          <Icon
            name="chevron-back"
            size={28}
            color="#000"
            onPress={() => {
              console.log('tapped');
              this.props.navigation.goBack();
            }}
          />
          {params?.friendImg?.length > 0 ? (
            <Image
              source={{
                uri: params?.friendImg,
              }}
              style={styles.friendProfile}
            />
          ) : (
            <Image
              style={styles.friendProfile}
              source={user}
              resizeMode="contain"
            />
          )}
          <Text style={styles.label}>{params?.friendName} </Text>
        </View>
        <KeyboardAvoidingView
          keyboardVerticalOffset={20}
          behavior={Platform.OS === 'android' ? 'height' : 'position'}
          enabled>
          <ScrollView
            style={{
              minHeight: Platform.OS == 'android' ? screenHeight : screenHeight,
            }}
            contentContainerStyle={{paddingBottom: 100}}
            ref={ref => {
              this.scrollJourney = ref;
            }}>
            <View style={[styles.chats]}>
              {chats?.map((a, i) => (
                <View key={i + 'usr'} style={{width: '100%'}}>
                  {a.from == 'user' ? (
                    <View style={[styles.item, styles.itemOut]}>
                      <View
                        style={[styles.balloon, {backgroundColor: '#4f58f2'}]}>
                        <View style={{paddingVertical: 5}}>
                          {a.chat_text ? (
                            <Text style={{color: '#fff'}}>{a.chat_text}</Text>
                          ) : null}
                        </View>
                      </View>
                      {this.props.login?.profileImg?.length > 0 ? (
                        <Image
                          source={{
                            uri: this.props.login?.profileImg,
                          }}
                          style={styles.profileImage}
                        />
                      ) : (
                        <Image
                          style={styles.profileImage}
                          source={user}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                  ) : (
                    <View style={[styles.item, styles.itemIn]}>
                      {params?.friendImg?.length > 0 ? (
                        <Image
                          source={{
                            uri: params?.friendImg,
                          }}
                          style={styles.profileImage}
                        />
                      ) : (
                        <Image
                          style={styles.profileImage}
                          source={user}
                          resizeMode="contain"
                        />
                      )}
                      <View
                        style={[styles.balloon, {backgroundColor: '#f2f2f2'}]}>
                        <View style={{paddingVertical: 5}}>
                          {a.chat_text ? (
                            <Text style={{color: '#000'}}>{a.chat_text}</Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.SectionStyle}>
            <View style={styles.inputView}>
              <TextInput
                placeholder="Enter Your Message "
                underlineColorAndroid="transparent"
                placeholderTextColor={'#000'}
                multiline
                style={styles.textview}
                onChangeText={text => this.setState({text})}
                value={this.state.text}
              />
            </View>
            {this.state.sending ? (
              <ActivityIndicator
                loading
                style={{
                  paddingHorizontal: 8,
                }}
                size={Platform.OS == 'ios' ? 'small' : 30}
                color={'#4f58f2'}
              />
            ) : (
              <SendIcon
                name="send"
                color="#4f58f2"
                onPress={() => this.sendMessage(params?.friend_id)}
                disabled={this.state.text == '' ? true : false}
                size={25}
                style={styles.iconStyle}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  item: {
    marginVertical: 7,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  itemIn: {},
  itemOut: {
    alignSelf: 'flex-end',
  },
  iconStyle: {
    paddingHorizontal: 8,
    borderRadius: 40,
  },
  textview: {
    borderRadius: 40,
    paddingLeft: 20,
    width: '90%',
    color: '#000',
  },
  inputView: {
    flexDirection: 'row',
    display: 'flex',
    width: '90%',
    paddingRight: 15,
    backgroundColor: '#edf0ff',
    alignItems: 'center',
    paddingVertical: Platform.OS == 'ios' ? 10 : 0,
    borderRadius: 40,
  },
  label: {
    color: '#000',
    fontSize: 16,
  },
  top: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    elevation: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    width: '100%',
    zIndex: 999,
  },
  balloon: {
    maxWidth: win.width * 0.6,
    minWidth: win.width * 0.1,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: win.width * 0.01,
    borderRadius: 20,
  },
  friendProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  topContainer: {
    backgroundColor: '#fff',
    elevation: 3,
    paddingTop: 20,
    marginBottom: 20,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  SectionStyle: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: '2.5%',
    paddingVertical: 10,
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    borderTopColor: '#000',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  chats: {
    flexDirection: 'column',
    flex: 1,
    marginTop: '18%',
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginHorizontal: 8,
  },
  userImage: {
    borderColor: 'black',
    borderWidth: 0.5,
    margin: 10,
    borderRadius: 10,
    width: 'auto',
    width: 250,
    height: 250,
    padding: 10,
    backgroundColor: '#EAECEC',
  },
});
function mapStateToProps(state, ownProps) {
  return {
    login: state.login,
  };
}
export default connect(mapStateToProps, actions)(Chat);
