import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {MyTextInputField} from '../components/MyTextField';
import UtilityFunctions from '../Utils/utilityfunctions';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

const add = require('../assets/add-image.png');

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.utils = new UtilityFunctions();
    this.state = {
      caption: '',
      image: '',
    };
  }
  componentDidMount() {}
  onChangeMyText = (type, data) => {
    this.setState({[type]: data});
  };
  createPost = async () => {
    if (this.state.image.length > 0) {
      this.setState({submitLogin: true});
      firestore()
        .collection('Posts')
        .add({
          uid: this.props.login?.uid,
          username: this.props.login?.username,
          profileImg: this.props.login?.profileImg,
          caption: this.state.caption,
          image: this.state.image,
          likeCount: 0,
          timestamp: Date.now(),
          likeArray: [],
          commentArray: [],
        })
        .then(() => {
          this.setState({submitLogin: false, caption: '', image: ''});
          ToastAndroid.show('Post added', ToastAndroid.SHORT);
        })
        .catch(() => {
          ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
          this.setState({submitLogin: false});
        });
    } else {
      ToastAndroid.show('Select an Image', ToastAndroid.SHORT);
    }
  };
  pickImage = async () => {
    const url = await this.utils.uploadImage();
    this.setState({image: `${url}.png`});
  };
  logOut = () => {
    auth()
      .signOut()
      .then(() => {
        this.props.resetLogin();
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <Icon
          name="logout"
          style={styles.logOut}
          color="#000"
          size={30}
          onPress={() => {
            this.logOut();
          }}
        />
        <TouchableOpacity onPress={() => this.pickImage()}>
          {this.state.image.length > 0 ? (
            <Image
              source={{uri: this.state.image}}
              style={styles.profileImg}
              resizeMode={'cover'}
            />
          ) : (
            <Image
              source={add}
              style={styles.profileImg}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        <View
          style={{
            marginHorizontal: 10,
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <MyTextInputField
            attrName="caption"
            title="Enter caption"
            value={this.state.caption}
            onChangeMyText={this.onChangeMyText}
          />
          <TouchableOpacity
            style={{width: '100%'}}
            onPress={() => {
              this.createPost();
            }}>
            <View style={styles.buttonContainer}>
              {this.state.submitLogin ? (
                <ActivityIndicator color={'silver'} size="small" />
              ) : (
                <Text style={styles.buttonText}>Post</Text>
              )}
            </View>
          </TouchableOpacity>
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

export default connect(mapStateToProps, actions, null)(Create);
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logOut: {
    position: 'absolute',
    top: 25,
    right: 25,
  },
  profileImg: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
  },
  textInputStyle: {
    borderWidth: 1,
    width: '40%',
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#0095f6',
    color: '#fff',
    margin: 8,
    borderRadius: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});
